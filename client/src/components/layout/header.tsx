import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { PlusIcon, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  onCreateRoom: () => void;
}

export const Header = ({ onCreateRoom }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-10 backdrop-blur-lg bg-background/80 border-b border-border">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <div className="cursor-pointer">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                VoiceVibe
              </h1>
            </div>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          <div className="hidden md:block relative">
            <Input 
              type="text" 
              placeholder="Search rooms" 
              className="bg-dark-surface border border-dark-border rounded-full px-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <SearchIcon className="h-4 w-4 absolute right-3 top-2.5 text-gray-400" />
          </div>
          
          <Button
            onClick={onCreateRoom}
            className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary rounded-full px-4 py-2 text-white hover:opacity-90 transition-opacity"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Create Room</span>
          </Button>
          
          <div className="md:hidden">
            <Button variant="ghost" size="icon" className="p-2 rounded-full hover:bg-dark-surface">
              <SearchIcon className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-1">
            <Avatar className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-primary">
              <AvatarImage 
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" 
                alt="User profile" 
              />
              <AvatarFallback>Me</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
};
