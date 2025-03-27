import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useLocation } from "wouter";

interface RoomControlsProps {
  onLeaveRoom: () => void;
}

export const RoomControls = ({ onLeaveRoom }: RoomControlsProps) => {
  const [isMuted, setIsMuted] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [_, setLocation] = useLocation();

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleRaiseHand = () => {
    setHandRaised(!handRaised);
  };

  const handleLeaveRoom = () => {
    onLeaveRoom();
    setLocation('/');
  };

  return (
    <div className="bg-dark-surface border-t border-dark-border py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            id="mute-toggle"
            variant="outline"
            onClick={handleMuteToggle}
            className="w-12 h-12 bg-dark-bg rounded-full flex items-center justify-center hover:bg-dark-border transition-colors p-0"
          >
            {isMuted ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 12H6" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            )}
          </Button>
          
          <Button
            id="raise-hand"
            variant="outline"
            onClick={handleRaiseHand}
            className="w-12 h-12 bg-dark-bg rounded-full flex items-center justify-center hover:bg-dark-border transition-colors p-0"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-6 w-6 ${handRaised ? 'text-primary' : 'text-gray-400'}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
            </svg>
          </Button>
        </div>
        
        <Button
          onClick={handleLeaveRoom}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-full transition duration-300 ease-in-out flex items-center space-x-2"
        >
          <LogOut className="h-4 w-4" />
          <span>Leave Room</span>
        </Button>
      </div>
    </div>
  );
};
