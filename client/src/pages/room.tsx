import { useParams, useLocation } from "wouter";
import { useEffect, useState, useCallback, useRef } from "react";
import { Room as RoomType, User } from "@/types";
import { RoomHeader } from "@/components/room/room-header";
import { SpeakersList } from "@/components/room/speakers-list";
import { ListenersList } from "@/components/room/listeners-list";
import { RoomControls } from "@/components/room/room-controls";
import { toast } from "@/hooks/use-toast";
import { simulateConversation } from "@/services/audio-service";
import { api } from "@/services/api-service";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export default function Room() {
  const { id } = useParams();
  const roomId = id ? parseInt(id) : 0;
  const [_, setLocation] = useLocation();
  const [isMuted, setIsMuted] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const conversationRef = useRef<{ stop: () => void } | null>(null);
  const speakerMapRef = useRef<Map<number, number>>(new Map()); // Maps speakerIndex -> userId

  // Fetch room data using React Query
  const { data: room, isLoading, error } = useQuery({
    queryKey: ['room', roomId],
    queryFn: () => api.rooms.getById(roomId)
  });

  // Handle room not found
  useEffect(() => {
    if (!isLoading && !room) {
      toast({
        title: "Room not found",
        description: "The room you're looking for doesn't exist or has ended.",
        variant: "destructive"
      });
      setLocation('/');
    }
  }, [room, isLoading, setLocation]);

  // Handle error
  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading room",
        description: "There was a problem loading the room data.",
        variant: "destructive"
      });
      setLocation('/');
    }
  }, [error, setLocation]);

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
              if (speakerId === undefined || !room) return;
              
              // Update the speaking state directly on the room object
              const updatedSpeakers = room.speakers.map(speaker => 
                speaker.id === speakerId 
                  ? { ...speaker, isSpeaking: true } 
                  : speaker
              );
              
              // Update the room in-memory
              Object.assign(room, {
                ...room,
                speakers: updatedSpeakers
              });
            },
            // When a speaker stops talking
            (speakerIndex) => {
              const speakerId = speakerMapRef.current.get(speakerIndex);
              if (speakerId === undefined || !room) return;
              
              // Update the speaking state directly on the room object
              const updatedSpeakers = room.speakers.map(speaker => 
                speaker.id === speakerId 
                  ? { ...speaker, isSpeaking: false } 
                  : speaker
              );
              
              // Update the room in-memory
              Object.assign(room, {
                ...room,
                speakers: updatedSpeakers
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

  // Handle becoming a speaker
  const handleBecomeASpeaker = useCallback(() => {
    if (!room) return;
    
    // Only proceed if you're currently a listener
    const youAsListener = room.listeners.find(l => l.isYou);
    if (!youAsListener) return;
    
    // Remove yourself from listeners
    const updatedListeners = room.listeners.filter(l => !l.isYou);
    
    // Add yourself to speakers
    const youAsSpeaker: User = {
      ...youAsListener,
      role: 'speaker',
      isMuted: isMuted,
      isSpeaking: false
    };
    
    // Update the room in-memory
    Object.assign(room, {
      ...room,
      speakers: [...room.speakers, youAsSpeaker],
      listeners: updatedListeners
    });
    
    toast({
      title: "You're now a speaker!",
      description: "You can now speak in the room."
    });
    
    setIsHandRaised(false);
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
    
    if (room) {
      // Find and update your user in either speakers or listeners
      const updatedSpeakers = room.speakers.map(speaker => 
        speaker.isYou ? { ...speaker, isMuted: !isMuted } : speaker
      );
      
      const updatedListeners = room.listeners.map(listener => 
        listener.isYou ? { ...listener, isMuted: !isMuted } : listener
      );
      
      // Update the room in-memory
      Object.assign(room, {
        ...room,
        speakers: updatedSpeakers,
        listeners: updatedListeners
      });
    }
  }, [isMuted, room]);

  // Handle leaving the room
  const handleLeaveRoom = useCallback(() => {
    // Stop audio simulation
    if (conversationRef.current) {
      conversationRef.current.stop();
      conversationRef.current = null;
    }
    
    toast({
      title: "Left the room",
      description: "You've left the voice room."
    });
    
    // Simulate API call to leave room
    api.rooms.leave(roomId).then(() => {
      // Navigate back to home
      setLocation('/');
    });
  }, [roomId, setLocation]);

  // Loading state
  if (isLoading) {
    return (
      <div className="h-screen bg-background flex flex-col">
        <div className="p-4 border-b">
          <Skeleton className="h-10 w-3/4 max-w-md" />
        </div>
        <div className="flex-1 overflow-auto p-4 space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-40" />
            <div className="flex flex-wrap gap-3">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-24 w-24 rounded-full" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-40" />
            <div className="flex flex-wrap gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <Skeleton key={i} className="h-16 w-16 rounded-full" />
              ))}
            </div>
          </div>
        </div>
        <div className="p-4 border-t">
          <div className="flex justify-center gap-6">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !room) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Room not found</h2>
          <p className="text-muted-foreground mb-4">The room you're looking for doesn't exist or has ended.</p>
          <button 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
            onClick={() => setLocation('/')}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      <RoomHeader room={room} onLeave={handleLeaveRoom} />
      
      <div className="flex-1 overflow-auto p-4 space-y-8">
        <SpeakersList speakers={room.speakers} />
        <ListenersList listeners={room.listeners} />
      </div>
      
      <RoomControls 
        isMuted={isMuted}
        isHandRaised={isHandRaised}
        onToggleMute={handleToggleMute}
        onRaiseHand={handleRaiseHand}
        onLeave={handleLeaveRoom}
      />
    </div>
  );
}
