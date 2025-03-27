import { Room } from "@/types";
import { AvatarGroup } from "@/components/ui/avatar-group";
import { TopicBadge } from "@/components/ui/topic-badge";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

interface RoomCardProps {
  room: Room;
}

export const RoomCard = ({ room }: RoomCardProps) => {
  const [_, setLocation] = useLocation();

  const handleJoinRoom = () => {
    setLocation(`/room/${room.id}`);
  };

  const formatStartTime = (dateString: string) => {
    return `Started ${formatDistanceToNow(new Date(dateString), { addSuffix: false })} ago`;
  };

  return (
    <motion.div
      className="room-card bg-dark-surface rounded-xl overflow-hidden border border-dark-border hover:border-primary/50 transition-all duration-300 ease-in-out shadow-lg cursor-pointer"
      whileHover={{ y: -5 }}
      onClick={handleJoinRoom}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <TopicBadge topic={room.topic as any} isLive={true} />
            <h3 className="font-semibold text-lg mt-1">{room.name}</h3>
          </div>
          <div className="flex items-center space-x-1 text-gray-400">
            <Users className="h-4 w-4" />
            <span className="text-xs">{room.participantCount}</span>
          </div>
        </div>
        
        <div className="mb-3">
          <AvatarGroup users={room.speakers} size="sm" />
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-400">
            <span>{formatStartTime(room.startedAt)}</span>
          </div>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleJoinRoom();
            }}
            variant="outline"
            className="bg-primary/20 text-primary hover:bg-primary/30 px-3 py-1 rounded-full text-xs font-medium transition border-none"
          >
            Join
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
