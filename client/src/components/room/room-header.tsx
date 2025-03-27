import { Room } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { useLocation } from "wouter";

interface RoomHeaderProps {
  room: Room;
}

export const RoomHeader = ({ room }: RoomHeaderProps) => {
  const [_, setLocation] = useLocation();

  const handleBack = () => {
    setLocation('/');
  };

  return (
    <header className="bg-dark-surface border-b border-dark-border py-4 px-6">
      <div className="flex justify-between items-center">
        <div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBack}
            className="text-gray-400 hover:text-white transition-colors mr-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 text-center">
          <h2 className="text-lg font-semibold">{room.name}</h2>
          <p className="text-sm text-gray-400">{room.topic} • {room.participantCount} participants</p>
        </div>
        
        <div>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white transition-colors">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
