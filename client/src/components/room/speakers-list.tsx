import { User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SpeakersListProps {
  speakers: User[];
}

export const SpeakersList = ({ speakers }: SpeakersListProps) => {
  return (
    <section className="mb-8">
      <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">
        Speakers ({speakers.length})
      </h3>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {speakers.map((speaker) => (
          <div key={speaker.id} className="flex flex-col items-center">
            <div className="relative mb-2">
              <div className={`w-16 h-16 rounded-full border-2 ${
                speaker.isSpeaking 
                  ? 'border-primary relative speaking-indicator' 
                  : 'border-dark-border'
              }`}>
                {speaker.isYou ? (
                  <div className="w-full h-full bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">You</span>
                  </div>
                ) : (
                  <Avatar className="w-full h-full">
                    <AvatarImage src={speaker.avatarUrl} alt={speaker.name} />
                    <AvatarFallback>
                      {speaker.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
              
              <div className="absolute bottom-0 right-0 bg-dark-bg rounded-full p-1">
                {speaker.isMuted ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 12H6" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                )}
              </div>
            </div>
            
            <span className="text-sm font-medium truncate w-full text-center">{speaker.name}</span>
            <span className="text-xs text-gray-400">
              {speaker.role === 'host' ? 'Host' : 'Speaker'}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
