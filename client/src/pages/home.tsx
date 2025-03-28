import { FeaturedRoom } from "@/components/home/featured-room";
import { RoomList } from "@/components/home/room-list";
import { rooms, featuredRoom } from "@/data/rooms";

export default function Home() {
  return (
    <div className="page-container animate-fade-in pb-16 md:pb-0">
      <main className="container mx-auto px-4 py-6">
        <FeaturedRoom room={featuredRoom} />
        <RoomList initialRooms={rooms} />
      </main>
    </div>
  );
}
