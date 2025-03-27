import { Room, Topic } from "@/types";
import { RoomCard } from "./room-card";
import { TopicFilter } from "./topic-filter";
import { useState } from "react";
import { getRoomsByTopic, getTopics } from "@/data/rooms";

interface RoomListProps {
  initialRooms: Room[];
}

export const RoomList = ({ initialRooms }: RoomListProps) => {
  const [currentTopic, setCurrentTopic] = useState<Topic>('All');
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const topics = getTopics();

  const handleTopicChange = (topic: Topic) => {
    setCurrentTopic(topic);
    setRooms(getRoomsByTopic(topic));
  };

  return (
    <section className="mb-20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Explore Rooms</h2>
        <TopicFilter 
          topics={topics} 
          currentTopic={currentTopic}
          onTopicChange={handleTopicChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </section>
  );
};
