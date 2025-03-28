import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Room from "@/pages/room";
import { useState } from "react";
import { CreateRoomModal } from "./components/modals/create-room-modal";
import { Header } from "./components/layout/header";
import { MobileNav } from "./components/layout/mobile-nav";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/room/:id" component={Room} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);
  const [location] = useLocation();
  const isRoomPage = location.startsWith('/room/');

  const handleCreateRoom = () => {
    setIsCreateRoomModalOpen(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col bg-background">
        {!isRoomPage && (
          <>
            <Header onCreateRoom={handleCreateRoom} />
            <MobileNav onCreateRoom={handleCreateRoom} />
          </>
        )}
        <main className="flex-1">
          <Router />
        </main>
        <CreateRoomModal 
          isOpen={isCreateRoomModalOpen} 
          onClose={() => setIsCreateRoomModalOpen(false)} 
        />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
