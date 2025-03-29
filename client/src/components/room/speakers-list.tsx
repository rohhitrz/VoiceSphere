import { User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SpeakingIndicator } from "@/components/ui/speaking-indicator";
import { MicOff } from "lucide-react";

interface SpeakersListProps {
  speakers: User[];
}

export const SpeakersList = ({ speakers }: SpeakersListProps) => {
  if (!speakers || speakers.length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className="text-xl font-medium mb-4">Speakers ({speakers.length})</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
        {speakers.map((speaker) => {
          const isHost = speaker.role === 'host';
          const isSpeaking = 'isSpeaking' in speaker && speaker.isSpeaking;
          const isMuted = 'isMuted' in speaker && speaker.isMuted;
          
          return (
            <div 
              key={speaker.id} 
              className="flex flex-col items-center text-center space-y-2"
            >
              <div className="relative">
                <Avatar className="w-20 h-20 border-2 border-primary rounded-full">
                  <AvatarImage src={speaker.avatarUrl} alt={speaker.name} />
                  <AvatarFallback>{speaker.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                {isSpeaking && !isMuted && (
                  <SpeakingIndicator />
                )}
                
                {isMuted && (
                  <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1 border border-border">
                    <MicOff className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>
              
              <div>
                <p className="font-medium truncate max-w-[120px]">
                  {speaker.name}
                  {speaker.isYou && <span className="text-primary ml-1">(You)</span>}
                </p>
                
                {isHost && (
                  <Badge variant="outline" className="mt-1 bg-primary/10 text-primary border-primary/20">
                    Host
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
