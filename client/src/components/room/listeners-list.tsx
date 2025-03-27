import { User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ListenersListProps {
  listeners: User[];
  maxVisible?: number;
}

export const ListenersList = ({ listeners, maxVisible = 16 }: ListenersListProps) => {
  const visibleListeners = listeners.slice(0, maxVisible);
  const remainingCount = listeners.length - maxVisible;
  
  return (
    <section>
      <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">
        Listeners ({listeners.length})
      </h3>
      
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
        {visibleListeners.map((listener) => (
          <div key={listener.id} className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full mb-2">
              {listener.isYou ? (
                <div className="w-full h-full bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">You</span>
                </div>
              ) : (
                <Avatar className="w-full h-full">
                  <AvatarImage src={listener.avatarUrl} alt={listener.name} />
                  <AvatarFallback>
                    {listener.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
            <span className="text-xs truncate w-full text-center">{listener.name}</span>
          </div>
        ))}
        
        {remainingCount > 0 && (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full mb-2 bg-dark-surface flex items-center justify-center">
              <span className="text-gray-400 text-xs font-medium">+{remainingCount}</span>
            </div>
            <span className="text-xs truncate w-full text-center text-gray-400">More</span>
          </div>
        )}
      </div>
    </section>
  );
};
