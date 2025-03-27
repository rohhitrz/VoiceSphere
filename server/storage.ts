import { User, InsertUser, Room, InsertRoom, RoomParticipant, InsertRoomParticipant } from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Room operations
  getAllRooms(): Promise<Room[]>;
  getRoomById(id: number): Promise<Room | undefined>;
  createRoom(room: InsertRoom): Promise<Room>;
  endRoom(id: number): Promise<Room | undefined>;
  
  // Room participant operations
  getRoomParticipants(roomId: number): Promise<RoomParticipant[]>;
  addParticipantToRoom(participant: InsertRoomParticipant): Promise<RoomParticipant>;
  removeParticipantFromRoom(roomId: number, userId: number): Promise<void>;
  updateParticipant(
    roomId: number, 
    userId: number, 
    updates: Partial<Pick<RoomParticipant, 'role' | 'isMuted' | 'isSpeaking'>>
  ): Promise<RoomParticipant | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private rooms: Map<number, Room>;
  private roomParticipants: Map<number, RoomParticipant>;
  private userIdCounter: number;
  private roomIdCounter: number;
  private participantIdCounter: number;

  constructor() {
    this.users = new Map();
    this.rooms = new Map();
    this.roomParticipants = new Map();
    this.userIdCounter = 1;
    this.roomIdCounter = 1;
    this.participantIdCounter = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: now 
    };
    this.users.set(id, user);
    return user;
  }

  // Room operations
  async getAllRooms(): Promise<Room[]> {
    return Array.from(this.rooms.values())
      .filter(room => room.isLive)
      .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());
  }

  async getRoomById(id: number): Promise<Room | undefined> {
    return this.rooms.get(id);
  }

  async createRoom(insertRoom: InsertRoom): Promise<Room> {
    const id = this.roomIdCounter++;
    const now = new Date();
    const room: Room = {
      ...insertRoom,
      id,
      isLive: true,
      startedAt: now,
      createdAt: now
    };
    this.rooms.set(id, room);
    return room;
  }

  async endRoom(id: number): Promise<Room | undefined> {
    const room = this.rooms.get(id);
    if (!room) return undefined;
    
    const updatedRoom = { ...room, isLive: false };
    this.rooms.set(id, updatedRoom);
    return updatedRoom;
  }

  // Room participant operations
  async getRoomParticipants(roomId: number): Promise<RoomParticipant[]> {
    return Array.from(this.roomParticipants.values())
      .filter(participant => participant.roomId === roomId);
  }

  async addParticipantToRoom(insertParticipant: InsertRoomParticipant): Promise<RoomParticipant> {
    const id = this.participantIdCounter++;
    const now = new Date();
    const participant: RoomParticipant = {
      ...insertParticipant,
      id,
      isSpeaking: false,
      joinedAt: now
    };
    this.roomParticipants.set(id, participant);
    return participant;
  }

  async removeParticipantFromRoom(roomId: number, userId: number): Promise<void> {
    const participantEntries = Array.from(this.roomParticipants.entries());
    for (const [id, participant] of participantEntries) {
      if (participant.roomId === roomId && participant.userId === userId) {
        this.roomParticipants.delete(id);
        break;
      }
    }
  }

  async updateParticipant(
    roomId: number, 
    userId: number, 
    updates: Partial<Pick<RoomParticipant, 'role' | 'isMuted' | 'isSpeaking'>>
  ): Promise<RoomParticipant | undefined> {
    const participantEntries = Array.from(this.roomParticipants.entries());
    for (const [id, participant] of participantEntries) {
      if (participant.roomId === roomId && participant.userId === userId) {
        const updatedParticipant = { ...participant, ...updates };
        this.roomParticipants.set(id, updatedParticipant);
        return updatedParticipant;
      }
    }
    return undefined;
  }
}

export const storage = new MemStorage();
