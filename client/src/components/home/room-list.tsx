import { Room, Topic } from "@/types";
import { RoomCard } from "./room-card";
import { TopicFilter } from "./topic-filter";
import { useEffect, useState } from "react";
import { api } from "@/services/api-service";
import { useSearch } from "@/context/search-context";

interface RoomListProps {
  initialRooms: Room[];
}

export const RoomList = ({ initialRooms }: RoomListProps) => {
  const { searchQuery, currentTopic, setCurrentTopic } = useSearch();
  const [displayedRooms, setDisplayedRooms] = useState<Room[]>(initialRooms);
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

  // Update displayed rooms when initialRooms, searchQuery, or currentTopic changes
  useEffect(() => {
    setIsLoading(true);
    
    // Filter rooms based on topic and search query
    const filteredRooms = initialRooms.filter(room => {
      // Filter by topic if not "All"
      const matchesTopic = currentTopic === 'All' || room.topic === currentTopic;
      
      // Filter by search query (case insensitive)
      const matchesSearch = searchQuery === '' || 
        room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (room.description && room.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesTopic && matchesSearch;
    });
    
    setDisplayedRooms(filteredRooms);
    setIsLoading(false);
  }, [initialRooms, searchQuery, currentTopic]);

  const handleTopicChange = async (topic: Topic) => {
    setCurrentTopic(topic);
    setIsLoading(true);
    
    try {
      const filteredRooms = await api.rooms.getByTopic(topic);
      setDisplayedRooms(filteredRooms);
    } catch (error) {
      console.error("Error fetching rooms by topic:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="mb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div>
          <h2 className="text-xl font-semibold">Explore Rooms</h2>
          {searchQuery && (
            <p className="text-sm text-muted-foreground">
              Showing results for "{searchQuery}"
            </p>
          )}
        </div>
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
        ) : displayedRooms.length === 0 ? (
          // Show empty state
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground">
              {searchQuery 
                ? `No rooms found matching "${searchQuery}"${currentTopic !== 'All' ? ` in ${currentTopic}` : ''}.` 
                : `No rooms available${currentTopic !== 'All' ? ` for ${currentTopic}` : ''}.`}
            </p>
          </div>
        ) : (
          // Show rooms
          displayedRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))
        )}
      </div>
    </section>
  );
};
