import { Room, Topic } from "@/types";
import { RoomCard } from "./room-card";
import { TopicFilter } from "./topic-filter";
import { useEffect, useState } from "react";
import { api } from "@/services/api-service";

interface RoomListProps {
  initialRooms: Room[];
}

export const RoomList = ({ initialRooms }: RoomListProps) => {
  const [currentTopic, setCurrentTopic] = useState<Topic>('All');
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [topics, setTopics] = useState<Topic[]>(['All']);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch topics on component mount
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const fetchedTopics = await api.topics.getAll();
        setTopics(fetchedTopics);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };
    
    fetchTopics();
  }, []);

  const handleTopicChange = async (topic: Topic) => {
    setCurrentTopic(topic);
    setIsLoading(true);
    
    try {
      const filteredRooms = await api.rooms.getByTopic(topic);
      setRooms(filteredRooms);
    } catch (error) {
      console.error("Error fetching rooms by topic:", error);
    } finally {
      setIsLoading(false);
    }
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
        {isLoading ? (
          // Show loading skeleton if loading
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 bg-card/50 animate-pulse rounded-lg"></div>
          ))
        ) : rooms.length === 0 ? (
          // Show empty state
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground">No rooms available for this topic.</p>
          </div>
        ) : (
          // Show rooms
          rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))
        )}
      </div>
    </section>
  );
};
