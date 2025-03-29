import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { PlusIcon, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "@/hooks/use-theme";

interface HeaderProps {
  onCreateRoom: () => void;
}

export const Header = ({ onCreateRoom }: HeaderProps) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Add your search logic here
    console.log("Searching for:", e.target.value);
  };

  return (
    <header className="sticky top-0 z-10 backdrop-blur-lg bg-background/80 border-b border-border">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <div className="cursor-pointer">
              <h1 className={`text-2xl font-bold ${theme === 'dark' ? 
                'bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text' : 
                'bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text'}`}>
                VoiceSphere
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
              value={searchQuery}
              onChange={handleSearchChange}
              className="bg-background border border-input rounded-full px-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            />
            <SearchIcon className="h-4 w-4 absolute right-3 top-2.5 text-muted-foreground" />
          </div>
          
          <Button
            onClick={onCreateRoom}
            className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary rounded-full px-4 py-2 text-white hover:opacity-90 transition-opacity"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Create Room</span>
          </Button>
          
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              className="p-2 rounded-full hover:bg-accent"
              onClick={() => {
                // Show mobile search modal or input
                console.log("Show mobile search");
              }}
            >
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
