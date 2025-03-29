import { Room } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { useLocation } from "wouter";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface RoomHeaderProps {
  room: Room;
  onLeave?: () => void;
}

export const RoomHeader = ({ room, onLeave }: RoomHeaderProps) => {
  const [_, setLocation] = useLocation();

  const handleBack = () => {
    if (onLeave) {
      onLeave();
    } else {
      setLocation('/');
    }
  };

  return (
    <header className="bg-background border-b border-border py-4 px-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBack}
            className="text-muted-foreground hover:text-foreground transition-colors mr-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 text-center">
          <h2 className="text-lg font-semibold">{room.name}</h2>
          <p className="text-sm text-muted-foreground">{room.topic} • {room.participantCount} participants</p>
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground transition-colors">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
