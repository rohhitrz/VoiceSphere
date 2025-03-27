import { Room } from "@/types";
import { AvatarGroup } from "@/components/ui/avatar-group";
import { Button } from "@/components/ui/button";
import { TopicBadge } from "@/components/ui/topic-badge";
import { useLocation } from "wouter";
import { Play } from "lucide-react";

interface FeaturedRoomProps {
  room: Room;
}

export const FeaturedRoom = ({ room }: FeaturedRoomProps) => {
  const [_, setLocation] = useLocation();

  const handleJoinRoom = () => {
    setLocation(`/room/${room.id}`);
  };

  return (
    <section className="mb-8 animate-slide-up">
      <h2 className="text-xl font-semibold mb-4">Happening Now</h2>
      <div className="bg-dark-surface rounded-2xl p-4 mb-4 md:mb-0 border border-dark-border relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-gradient-to-bl from-primary/20 to-secondary/10 w-40 h-40 rounded-bl-full"></div>
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="flex-1 z-10">
            <div className="flex items-center">
              <TopicBadge topic={room.topic as any} isLive={true} />
            </div>
            <h3 className="text-xl font-bold mt-1 mb-2">{room.name}</h3>
            <p className="text-gray-400 mb-3 md:max-w-lg text-sm">{room.description}</p>
            
            <div className="mb-4">
              <AvatarGroup users={room.speakers} size="md" />
            </div>

            <Button 
              onClick={handleJoinRoom}
              className="bg-primary hover:bg-primary/90 text-white py-2 px-6 rounded-full text-sm font-medium transition duration-300 ease-in-out transform hover:scale-105 flex items-center space-x-2"
            >
              <Play className="h-4 w-4" />
              <span>Join Room</span>
            </Button>
          </div>
          <div className="hidden md:block md:w-1/4">
            <div className="relative w-full h-32">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full opacity-20 animate-pulse-slow"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full opacity-30 animate-pulse-slow"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
