import { Link, useLocation } from "wouter";
import { PlusIcon, HomeIcon, BookOpenIcon, BellIcon, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

interface MobileNavProps {
  onCreateRoom: () => void;
}

export const MobileNav = ({ onCreateRoom }: MobileNavProps) => {
  const [location] = useLocation();
  const { theme } = useTheme();

  return (
    <nav className="md:hidden fixed bottom-0 w-full bg-background border-t border-border z-40">
      <div className="flex justify-around items-center h-16">
        <Link href="/">
          <div className={`flex flex-col items-center justify-center cursor-pointer ${location === '/' ? 'text-primary' : 'text-muted-foreground hover:text-foreground transition-colors'}`}>
            <HomeIcon className="h-6 w-6" />
            <span className="text-xs mt-1">Explore</span>
          </div>
        </Link>
        
        <Link href="/my-rooms">
          <div className="flex flex-col items-center justify-center cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
            <BookOpenIcon className="h-6 w-6" />
            <span className="text-xs mt-1">My Rooms</span>
          </div>
        </Link>
        
        <Button
          onClick={onCreateRoom}
          className="flex flex-col items-center justify-center bg-none p-0 h-auto"
        >
          <div className="bg-gradient-to-r from-primary to-secondary rounded-full h-12 w-12 flex items-center justify-center shadow-lg">
            <PlusIcon className="h-6 w-6 text-white" />
          </div>
        </Button>
        
        <Link href="/notifications">
          <div className="flex flex-col items-center justify-center cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
            <BellIcon className="h-6 w-6" />
            <span className="text-xs mt-1">Alerts</span>
          </div>
        </Link>
        
        <Link href="/profile">
          <div className="flex flex-col items-center justify-center cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
            <UserIcon className="h-6 w-6" />
            <span className="text-xs mt-1">Profile</span>
          </div>
        </Link>
      </div>
    </nav>
  );
};
