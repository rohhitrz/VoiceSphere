import { useState } from "react";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { FeaturedRoom } from "@/components/home/featured-room";
import { RoomList } from "@/components/home/room-list";
import { CreateRoomModal } from "@/components/modals/create-room-modal";
import { rooms, featuredRoom } from "@/data/rooms";

export default function Home() {
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);

  const handleOpenCreateRoomModal = () => {
    setIsCreateRoomModalOpen(true);
  };

  return (
    <div className="page-container animate-fade-in pb-16 md:pb-0">
      <Header onCreateRoom={handleOpenCreateRoomModal} />
      
      <main className="container mx-auto px-4 py-6">
        <FeaturedRoom room={featuredRoom} />
        <RoomList initialRooms={rooms} />
      </main>
      
      <MobileNav onCreateRoom={handleOpenCreateRoomModal} />
      
      <CreateRoomModal 
        isOpen={isCreateRoomModalOpen} 
        onClose={() => setIsCreateRoomModalOpen(false)} 
      />
    </div>
  );
}
