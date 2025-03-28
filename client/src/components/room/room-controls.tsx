import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Mic, MicOff, Hand } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface RoomControlsProps {
  onLeaveRoom: () => void;
  onToggleMute?: (isMuted: boolean) => void;
  onRaiseHand?: () => void;
  isMuted?: boolean;
  isHandRaised?: boolean;
}

export const RoomControls = ({ 
  onLeaveRoom, 
  onToggleMute, 
  onRaiseHand,
  isMuted = false,
  isHandRaised = false
}: RoomControlsProps) => {
  // Refs for audio recording and playback
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // State to track recording status
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [micPermission, setMicPermission] = useState<boolean | null>(null);
  
  // Setup audio element
  useEffect(() => {
    audioElementRef.current = new Audio();
    
    // Check if microphone is available
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        setMicPermission(true);
        streamRef.current = stream;
        
        // Stop the tracks immediately to avoid unnecessary microphone use
        stream.getTracks().forEach(track => track.stop());
      })
      .catch((err) => {
        console.error("Microphone permission denied:", err);
        setMicPermission(false);
        toast({
          title: "Microphone access denied",
          description: "Please enable microphone access to use the speaking feature.",
          variant: "destructive"
        });
      });
      
    return () => {
      // Clean up when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current = null;
      }
      
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, []);
  
  // Start recording
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Reset audio chunks
      audioChunksRef.current = [];
      
      // Create new media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      // Add data to chunks when available
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      // Handle recording stop
      mediaRecorder.onstop = () => {
        // Create blob from audio chunks
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        
        // Create URL for the audio blob
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        
        // Play the recorded audio
        if (audioElementRef.current) {
          audioElementRef.current.src = url;
          audioElementRef.current.play();
        }
        
        // Stop tracks
        stream.getTracks().forEach(track => track.stop());
        
        setIsRecording(false);
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: "Recording started",
        description: "You are now live! Others can hear you speak."
      });
      
    } catch (err) {
      console.error("Error starting recording:", err);
      setMicPermission(false);
      
      toast({
        title: "Recording failed",
        description: "Could not access your microphone. Please check your permissions.",
        variant: "destructive"
      });
    }
  }, []);
  
  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      
      // Stop all tracks in the stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      toast({
        title: "Recording stopped",
        description: "Your audio will be played back to the room."
      });
    }
  }, [isRecording]);
  
  // Toggle mute state
  const handleMuteToggle = useCallback(() => {
    if (onToggleMute) {
      onToggleMute(!isMuted);
    }
    
    if (!isMuted) {
      // If we're muting, stop any ongoing recording
      if (isRecording) {
        stopRecording();
      }
    }
  }, [isMuted, isRecording, onToggleMute, stopRecording]);
  
  // Toggle microphone (press-to-talk)
  const handleMicToggle = useCallback(() => {
    if (isMuted) {
      toast({
        title: "You are muted",
        description: "Unmute yourself to start speaking",
        variant: "destructive"
      });
      return;
    }
    
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isMuted, isRecording, startRecording, stopRecording]);
  
  // Handle microphone button press and release
  const handleMicMouseDown = useCallback(() => {
    if (!isMuted && micPermission) {
      startRecording();
    }
  }, [isMuted, micPermission, startRecording]);
  
  const handleMicMouseUp = useCallback(() => {
    if (isRecording) {
      stopRecording();
    }
  }, [isRecording, stopRecording]);
  
  // Handle raise hand
  const handleRaiseHand = useCallback(() => {
    if (onRaiseHand) {
      onRaiseHand();
    }
  }, [onRaiseHand]);

  return (
    <div className="bg-dark-surface border-t border-dark-border py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mute toggle button */}
          <Button
            id="mute-toggle"
            variant="outline"
            onClick={handleMuteToggle}
            className="w-12 h-12 bg-dark-bg rounded-full flex items-center justify-center hover:bg-dark-border transition-colors p-0"
          >
            {isMuted ? (
              <MicOff className="h-6 w-6 text-red-500" />
            ) : (
              <Mic className="h-6 w-6 text-green-500" />
            )}
          </Button>
          
          {/* Press-to-talk button */}
          <Button
            id="press-to-talk"
            variant={isRecording ? "destructive" : "outline"}
            onMouseDown={handleMicMouseDown}
            onMouseUp={handleMicMouseUp}
            onMouseLeave={handleMicMouseUp} // In case mouse leaves while pressed
            onTouchStart={handleMicMouseDown}
            onTouchEnd={handleMicMouseUp}
            disabled={isMuted || micPermission === false}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors p-0 ${
              isRecording 
                ? 'animate-pulse bg-red-500 text-white border-red-500' 
                : 'bg-dark-bg hover:bg-dark-border'
            }`}
          >
            <Mic className={`h-6 w-6 ${isRecording ? 'text-white' : 'text-gray-400'}`} />
          </Button>
          
          {/* Raise hand button */}
          <Button
            id="raise-hand"
            variant="outline"
            onClick={handleRaiseHand}
            className="w-12 h-12 bg-dark-bg rounded-full flex items-center justify-center hover:bg-dark-border transition-colors p-0"
          >
            <Hand className={`h-6 w-6 ${isHandRaised ? 'text-primary' : 'text-gray-400'}`} />
          </Button>
        </div>
        
        <Button
          onClick={onLeaveRoom}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-full transition duration-300 ease-in-out flex items-center space-x-2"
        >
          <LogOut className="h-4 w-4" />
          <span>Leave Room</span>
        </Button>
      </div>
    </div>
  );
};
