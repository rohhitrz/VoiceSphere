import { Room, Topic, User } from "@/types";
import { getRoomById, getRoomsByTopic, getTopics, rooms } from "@/data/rooms";
import { users } from "@/data/users";

// Simulate API latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock API service - simulates backend interactions
 * with mock data from our local files
 */
export const api = {
  // Room related endpoints
  rooms: {
    // Get all available rooms
    getAll: async (): Promise<Room[]> => {
      await delay(300); // Simulate network delay
      return rooms;
    },
    
    // Get rooms filtered by topic
    getByTopic: async (topic: Topic): Promise<Room[]> => {
      await delay(400);
      return getRoomsByTopic(topic);
    },
    
    // Get a single room by ID
    getById: async (id: number): Promise<Room | undefined> => {
      await delay(350);
      return getRoomById(id);
    },
    
    // Create a new room
    create: async (roomData: Partial<Room>): Promise<Room> => {
      await delay(500);
      
      // Generate a new ID (would normally be done by the backend)
      const newId = Math.max(...rooms.map(r => r.id)) + 1;
      
      // Find the user marked as "you"
      const youUser = users.find(u => u.isYou);
      
      // Create the new room with default values
      const newRoom: Room = {
        id: newId,
        name: roomData.name || "Untitled Room",
        topic: roomData.topic || "General",
        description: roomData.description || "",
        isLive: true,
        startedAt: new Date().toISOString(),
        participantCount: 1,
        speakers: youUser ? [{ ...youUser, role: "host", isSpeaking: false, isMuted: false }] : [],
        listeners: []
      };
      
      // In a real app, this would be added to the database
      // For our frontend-only app, we'll add it to our mock data
      rooms.push(newRoom);
      
      return newRoom;
    },
    
    // Leave a room
    leave: async (roomId: number): Promise<boolean> => {
      await delay(200);
      return true;
    },
    
    // Join a room
    join: async (roomId: number): Promise<boolean> => {
      await delay(300);
      return true;
    }
  },
  
  // User related endpoints
  users: {
    // Get all users
    getAll: async (): Promise<User[]> => {
      await delay(300);
      return users;
    },
    
    // Get current user (the one marked with isYou)
    getCurrentUser: async (): Promise<User | undefined> => {
      await delay(100);
      return users.find(user => user.isYou);
    },
    
    // Update user profile
    updateProfile: async (userData: Partial<User>): Promise<User> => {
      await delay(400);
      const currentUser = users.find(user => user.isYou);
      
      if (!currentUser) {
        throw new Error("Current user not found");
      }
      
      // Update user properties
      Object.assign(currentUser, userData);
      
      return currentUser;
    }
  },
  
  // Get available topics
  topics: {
    getAll: async (): Promise<Topic[]> => {
      await delay(200);
      return getTopics();
    }
  }
}; 