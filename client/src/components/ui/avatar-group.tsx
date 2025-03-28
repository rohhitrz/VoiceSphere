import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types";
import { SpeakingIndicator } from "./speaking-indicator";

interface AvatarGroupProps {
  users: User[];
  maxVisible?: number;
  size?: 'sm' | 'md' | 'lg';
  showSpeakingIndicator?: boolean;
}

export const AvatarGroup = ({ 
  users, 
  maxVisible = 3, 
  size = 'md',
  showSpeakingIndicator = true
}: AvatarGroupProps) => {
  // Create a copy of users array to avoid modifying the original
  const [localUsers, setLocalUsers] = useState<User[]>([...users]);
  
  // Simulate realistic speaking patterns
  useEffect(() => {
    // Don't simulate if we've been given specific speaking states already
    const hasExplicitSpeakingStates = users.some(user => typeof user.isSpeaking !== 'undefined');
    if (!showSpeakingIndicator || hasExplicitSpeakingStates) {
      setLocalUsers([...users]);
      return;
    }
    
    // Only speakers can speak
    const speakers = localUsers.filter(user => user.role === 'host' || user.role === 'speaker');
    if (speakers.length === 0) return;
    
    const simulateSpeaking = () => {
      setLocalUsers(prevUsers => {
        // Create a new copy of the users
        const newUsers = [...prevUsers];
        
        // Randomly decide if we should change who's speaking
        const shouldChangeSpeaker = Math.random() > 0.7;
        
        if (shouldChangeSpeaker) {
          // First, make everyone not speaking
          newUsers.forEach(user => {
            if (user.isSpeaking) {
              user.isSpeaking = false;
            }
          });
          
          // Randomly select 0-2 speakers to be speaking
          const numSpeaking = Math.floor(Math.random() * 2) + (Math.random() > 0.3 ? 1 : 0);
          
          // Get only non-muted speakers
          const availableSpeakers = speakers.filter(speaker => !speaker.isMuted);
          
          // Make random speakers speak
          for (let i = 0; i < Math.min(numSpeaking, availableSpeakers.length); i++) {
            const randomIndex = Math.floor(Math.random() * availableSpeakers.length);
            const speakerId = availableSpeakers[randomIndex].id;
            
            // Find this user in our newUsers array and make them speak
            const userToSpeak = newUsers.find(u => u.id === speakerId);
            if (userToSpeak) {
              userToSpeak.isSpeaking = true;
            }
            
            // Remove this speaker from available speakers to avoid selecting them again
            availableSpeakers.splice(randomIndex, 1);
          }
        }
        
        return newUsers;
      });
      
      // Schedule next speaking change
      const nextChangeDelay = Math.random() * 3000 + 2000; // 2-5 seconds between changes
      setTimeout(simulateSpeaking, nextChangeDelay);
    };
    
    // Start simulation
    const initialDelay = Math.random() * 1000 + 500; // 0.5-1.5 seconds initial delay
    const timer = setTimeout(simulateSpeaking, initialDelay);
    
    return () => clearTimeout(timer);
  }, [users, showSpeakingIndicator]);
  
  const visibleUsers = localUsers.slice(0, maxVisible);
  const remaining = localUsers.length - maxVisible;

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-base'
  };

  return (
    <div className="flex -space-x-2">
      {visibleUsers.map((user) => (
        <div key={user.id} className={`relative ${showSpeakingIndicator && user.isSpeaking ? 'z-30' : ''}`}>
          <div 
            className={`${sizeClasses[size]} rounded-full border-2 relative ${
              user.isSpeaking && showSpeakingIndicator 
                ? 'border-primary z-10' 
                : 'border-dark-surface'
            }`}
          >
            {user.isYou ? (
              <div className="w-full h-full bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">You</span>
              </div>
            ) : (
              <Avatar className="w-full h-full">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            )}
            
            {/* Speaking indicator as a separate component */}
            {showSpeakingIndicator && user.isSpeaking && (
              <SpeakingIndicator 
                isSpeaking={true} 
                intensity={Math.random() > 0.5 ? 'medium' : (Math.random() > 0.5 ? 'intense' : 'slight')}
              />
            )}
          </div>
          
          {/* Mute status indicator */}
          {showSpeakingIndicator && user.isMuted && (
            <div className="absolute bottom-0 right-0 bg-dark-bg rounded-full p-1 z-20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 12H6" />
              </svg>
            </div>
          )}
          {showSpeakingIndicator && !user.isMuted && (
            <div className="absolute bottom-0 right-0 bg-dark-bg rounded-full p-1 z-20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
          )}
        </div>
      ))}

      {remaining > 0 && (
        <div className={`${sizeClasses[size]} rounded-full border-2 border-dark-surface bg-dark-surface flex items-center justify-center text-xs font-medium text-gray-400 z-0`}>
          +{remaining}
        </div>
      )}
    </div>
  );
};
