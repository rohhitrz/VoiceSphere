import { User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MicOff } from "lucide-react";

interface ListenersListProps {
  listeners: User[];
}

export const ListenersList = ({ listeners }: ListenersListProps) => {
  if (!listeners || listeners.length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className="text-xl font-medium mb-4">Listeners ({listeners.length})</h3>
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-8 gap-3">
        {listeners.map((listener) => {
          const isMuted = 'isMuted' in listener && listener.isMuted;
          
          return (
            <div 
              key={listener.id} 
              className="flex flex-col items-center text-center space-y-2"
            >
              <div className="relative">
                <Avatar className="w-12 h-12 border border-border rounded-full">
                  <AvatarImage src={listener.avatarUrl} alt={listener.name} />
                  <AvatarFallback>{listener.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                {isMuted && (
                  <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5 border border-border">
                    <MicOff className="h-3 w-3 text-muted-foreground" />
                  </div>
                )}
              </div>
              
              <p className="text-sm truncate max-w-[80px]">
                {listener.name}
                {listener.isYou && <span className="text-primary ml-1">(You)</span>}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
