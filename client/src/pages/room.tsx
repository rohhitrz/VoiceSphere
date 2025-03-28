import { useParams, useLocation } from "wouter";
import { useEffect, useState, useCallback, useRef } from "react";
import { Room as RoomType, User } from "@/types";
import { RoomHeader } from "@/components/room/room-header";
import { SpeakersList } from "@/components/room/speakers-list";
import { ListenersList } from "@/components/room/listeners-list";
import { RoomControls } from "@/components/room/room-controls";
import { getRoomById } from "@/data/rooms";
import { toast } from "@/hooks/use-toast";
import { simulateConversation } from "@/services/audio-service";

export default function Room() {
  const { id } = useParams();
  const [room, setRoom] = useState<RoomType | null>(null);
  const [_, setLocation] = useLocation();
  const [isMuted, setIsMuted] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const conversationRef = useRef<{ stop: () => void } | null>(null);
  const speakerMapRef = useRef<Map<number, number>>(new Map()); // Maps speakerIndex -> userId

  // Load room data
  useEffect(() => {
    if (id) {
      const roomData = getRoomById(parseInt(id));
      if (roomData) {
        // Ensure "You" is added to the room
        const youUser = roomData.listeners.find(user => user.isYou);
        if (!youUser) {
          // Add you to the listeners if not already there
          const updatedRoom = {
            ...roomData,
            listeners: [
              ...roomData.listeners, 
              {
                id: 999,
                name: "You",
                username: "you",
                avatarUrl: "",
                role: "listener" as const,
                isYou: true,
                isMuted: false
              }
            ]
          };
          setRoom(updatedRoom);
        } else {
          setRoom(roomData);
        }
      } else {
        toast({
          title: "Room not found",
          description: "The room you're looking for doesn't exist or has ended.",
          variant: "destructive"
        });
        setLocation('/');
      }
    }
  }, [id, setLocation]);

  // Start voice simulation when room is loaded
  useEffect(() => {
    if (!room) return;
    
    // Clean up any existing simulation
    if (conversationRef.current) {
      conversationRef.current.stop();
      conversationRef.current = null;
    }
    
    // Only start if we have speakers
    if (room.speakers.length > 0) {
      // Get non-muted speakers
      const availableSpeakers = room.speakers.filter(speaker => !speaker.isMuted && !speaker.isYou);
      
      if (availableSpeakers.length > 0) {
        // Create a mapping of simulation indexes to speaker IDs
        speakerMapRef.current.clear();
        availableSpeakers.forEach((speaker, index) => {
          speakerMapRef.current.set(index, speaker.id);
        });
        
        // Start conversation simulation
        try {
          conversationRef.current = simulateConversation(
            availableSpeakers.length,
            // When a speaker starts talking
            (speakerIndex) => {
              const speakerId = speakerMapRef.current.get(speakerIndex);
              if (speakerId === undefined) return;
              
              setRoom((prevRoom) => {
                if (!prevRoom) return null;
                
                // Update speaking state for this speaker
                const updatedSpeakers = prevRoom.speakers.map(speaker => 
                  speaker.id === speakerId 
                    ? { ...speaker, isSpeaking: true } 
                    : speaker
                );
                
                return {
                  ...prevRoom,
                  speakers: updatedSpeakers
                };
              });
            },
            // When a speaker stops talking
            (speakerIndex) => {
              const speakerId = speakerMapRef.current.get(speakerIndex);
              if (speakerId === undefined) return;
              
              setRoom((prevRoom) => {
                if (!prevRoom) return null;
                
                // Update speaking state for this speaker
                const updatedSpeakers = prevRoom.speakers.map(speaker => 
                  speaker.id === speakerId 
                    ? { ...speaker, isSpeaking: false } 
                    : speaker
                );
                
                return {
                  ...prevRoom,
                  speakers: updatedSpeakers
                };
              });
            }
          );
        } catch (err) {
          console.warn("Could not start audio simulation:", err);
        }
      }
    }
    
    // Clean up conversation simulation when unmounting
    return () => {
      if (conversationRef.current) {
        conversationRef.current.stop();
        conversationRef.current = null;
      }
    };
  }, [room?.id]); // Only re-run if the room ID changes

  // Update your mute status
  useEffect(() => {
    if (!room) return;
    
    setRoom(prevRoom => {
      if (!prevRoom) return null;
      
      // Find and update your user in either speakers or listeners
      const updatedSpeakers = prevRoom.speakers.map(speaker => 
        speaker.isYou ? { ...speaker, isMuted } : speaker
      );
      
      const updatedListeners = prevRoom.listeners.map(listener => 
        listener.isYou ? { ...listener, isMuted } : listener
      );
      
      return {
        ...prevRoom,
        speakers: updatedSpeakers,
        listeners: updatedListeners
      };
    });
  }, [isMuted]);

  // Handle becoming a speaker
  const handleBecomeASpeaker = useCallback(() => {
    if (!room) return;
    
    // Only proceed if you're currently a listener
    const youAsListener = room.listeners.find(l => l.isYou);
    if (!youAsListener) return;
    
    setRoom(prevRoom => {
      if (!prevRoom) return null;
      
      // Remove yourself from listeners
      const updatedListeners = prevRoom.listeners.filter(l => !l.isYou);
      
      // Add yourself to speakers
      const youAsSpeaker: User = {
        ...youAsListener,
        role: 'speaker',
        isMuted: isMuted,
        isSpeaking: false
      };
      
      toast({
        title: "You're now a speaker!",
        description: "You can now speak in the room."
      });
      
      setIsHandRaised(false);
      
      return {
        ...prevRoom,
        speakers: [...prevRoom.speakers, youAsSpeaker],
        listeners: updatedListeners
      };
    });
  }, [room, isMuted]);
  
  // Handle raising your hand
  const handleRaiseHand = useCallback(() => {
    setIsHandRaised(prev => !prev);
    
    if (!isHandRaised) {
      toast({
        title: "Hand raised",
        description: "The host has been notified that you want to speak."
      });
      
      // Simulate becoming a speaker after a delay
      setTimeout(() => {
        toast({
          title: "The host made you a speaker",
          description: "You can now speak in the room."
        });
        handleBecomeASpeaker();
      }, 3000);
    } else {
      toast({
        title: "Hand lowered",
        description: "You've canceled your request to speak."
      });
    }
  }, [isHandRaised, handleBecomeASpeaker]);

  // Handle mute/unmute
  const handleToggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
    
    toast({
      title: isMuted ? "Unmuted" : "Muted",
      description: isMuted ? "You are now unmuted." : "You are now muted."
    });
  }, [isMuted]);

  // Handle leaving the room
  const handleLeaveRoom = useCallback(() => {
    // Stop audio simulation
    if (conversationRef.current) {
      conversationRef.current.stop();
      conversationRef.current = null;
    }
    
    toast({
      title: "Left the room",
      description: "You have left the room successfully."
    });
    setLocation('/');
  }, [setLocation]);

  if (!room) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen animate-fade-in">
      <RoomHeader room={room} />
      
      <div className="flex-1 overflow-y-auto p-6">
        <SpeakersList speakers={room.speakers} />
        <ListenersList listeners={room.listeners} />
      </div>
      
      <RoomControls 
        onLeaveRoom={handleLeaveRoom} 
        onToggleMute={handleToggleMute}
        onRaiseHand={handleRaiseHand}
        isMuted={isMuted}
        isHandRaised={isHandRaised}
      />
    </div>
  );
}
