import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { getTopics } from "@/data/rooms";
import { Topic } from "@/types";
import { toast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateRoomModal = ({ isOpen, onClose }: CreateRoomModalProps) => {
  const [_, setLocation] = useLocation();
  const [roomName, setRoomName] = useState("");
  const [roomTopic, setRoomTopic] = useState<Topic | "">("");
  const [roomDescription, setRoomDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const topics = getTopics();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!roomName || !roomTopic) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    // Mock creating a room
    toast({
      title: "Room Created!",
      description: `"${roomName}" room is now live.`,
    });
    
    // Close the modal and navigate to a mock room (first room)
    onClose();
    setLocation("/room/1");
    
    // Reset form
    setRoomName("");
    setRoomTopic("");
    setRoomDescription("");
    setIsPublic(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dark-surface border border-dark-border rounded-xl w-full max-w-md p-6 relative shadow-xl animate-slide-up">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create a Room</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <Label htmlFor="room-name" className="block text-sm font-medium mb-1">Room Name</Label>
            <Input
              id="room-name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Give your room a name"
              required
            />
          </div>
          
          <div className="mb-4">
            <Label htmlFor="room-topic" className="block text-sm font-medium mb-1">Topic</Label>
            <Select value={roomTopic} onValueChange={(value) => setRoomTopic(value as Topic)}>
              <SelectTrigger 
                id="room-topic"
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <SelectValue placeholder="Select a topic" />
              </SelectTrigger>
              <SelectContent>
                {topics.filter(topic => topic !== 'All').map((topic) => (
                  <SelectItem key={topic} value={topic}>
                    {topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="mb-4">
            <Label htmlFor="room-description" className="block text-sm font-medium mb-1">Description (optional)</Label>
            <Textarea
              id="room-description"
              value={roomDescription}
              onChange={(e) => setRoomDescription(e.target.value)}
              rows={3}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="What's this room about?"
            />
          </div>
          
          <div className="flex items-center mb-4">
            <Checkbox 
              id="room-public" 
              checked={isPublic}
              onCheckedChange={(checked) => setIsPublic(checked as boolean)}
              className="rounded bg-dark-bg border-dark-border text-primary focus:ring-primary"
            />
            <Label htmlFor="room-public" className="ml-2 text-sm">Make this room public</Label>
          </div>
          
          <DialogFooter className="flex justify-end space-x-3 mt-6">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="border border-dark-border rounded-lg hover:bg-dark-bg transition-colors">
                Cancel
              </Button>
            </DialogClose>
            <Button 
              type="submit" 
              className="px-4 py-2 bg-gradient-to-r from-primary to-secondary rounded-lg text-white hover:opacity-90 transition-opacity"
            >
              Start Room
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
