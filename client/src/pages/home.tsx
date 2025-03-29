import { FeaturedRoom } from "@/components/home/featured-room";
import { RoomList } from "@/components/home/room-list";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api-service";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: rooms, isLoading } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => api.rooms.getAll(),
  });

  const featuredRoom = rooms?.[0];

  if (isLoading) {
    return (
      <div className="page-container animate-fade-in pb-16 md:pb-0">
        <main className="container mx-auto px-4 py-6">
          <div className="space-y-4 mb-8">
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-60 rounded-xl" />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page-container animate-fade-in pb-16 md:pb-0">
      <main className="container mx-auto px-4 py-6">
        {featuredRoom && <FeaturedRoom room={featuredRoom} />}
        <RoomList initialRooms={rooms || []} />
      </main>
    </div>
  );
}
