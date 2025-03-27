import { useParams, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Room as RoomType } from "@/types";
import { RoomHeader } from "@/components/room/room-header";
import { SpeakersList } from "@/components/room/speakers-list";
import { ListenersList } from "@/components/room/listeners-list";
import { RoomControls } from "@/components/room/room-controls";
import { getRoomById } from "@/data/rooms";
import { toast } from "@/hooks/use-toast";

export default function Room() {
  const { id } = useParams();
  const [room, setRoom] = useState<RoomType | null>(null);
  const [_, setLocation] = useLocation();

  useEffect(() => {
    if (id) {
      const roomData = getRoomById(parseInt(id));
      if (roomData) {
        setRoom(roomData);
      } else {
        toast({
          title: "Room not found",
          description: "The room you're looking for doesn't exist or has ended.",
          variant: "destructive"
        });
        setLocation('/');
      }
    }
  }, [id, setLocation]);

  const handleLeaveRoom = () => {
    toast({
      title: "Left the room",
      description: "You have left the room successfully."
    });
  };

  if (!room) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen animate-fade-in">
      <RoomHeader room={room} />
      
      <div className="flex-1 overflow-y-auto p-6">
        <SpeakersList speakers={room.speakers} />
        <ListenersList listeners={room.listeners} />
      </div>
      
      <RoomControls onLeaveRoom={handleLeaveRoom} />
    </div>
  );
}
