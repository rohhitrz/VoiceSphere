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
  const visibleUsers = users.slice(0, maxVisible);
  const remaining = users.length - maxVisible;

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
            className={`${sizeClasses[size]} rounded-full border-2 ${
              user.isSpeaking && showSpeakingIndicator 
                ? 'border-primary relative speaking-indicator' 
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
          </div>
          {showSpeakingIndicator && user.isMuted && (
            <div className="absolute bottom-0 right-0 bg-dark-bg rounded-full p-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 12H6" />
              </svg>
            </div>
          )}
          {showSpeakingIndicator && !user.isMuted && (
            <div className="absolute bottom-0 right-0 bg-dark-bg rounded-full p-1">
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
