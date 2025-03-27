import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRoomSchema, insertUserSchema, insertRoomParticipantSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // ========== User Routes ==========
  
  // Get user by ID
  app.get("/api/users/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await storage.getUser(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Don't send the password
    const { password, ...userData } = user;
    res.json(userData);
  });

  // Create a new user
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const newUser = await storage.createUser(userData);
      
      // Don't return the password
      const { password, ...user } = newUser;
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  // ========== Room Routes ==========
  
  // Get all rooms (active)
  app.get("/api/rooms", async (req, res) => {
    const rooms = await storage.getAllRooms();
    res.json(rooms);
  });

  // Get room by ID
  app.get("/api/rooms/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid room ID" });
    }

    const room = await storage.getRoomById(id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const participants = await storage.getRoomParticipants(id);
    res.json({ ...room, participants });
  });

  // Create a new room
  app.post("/api/rooms", async (req, res) => {
    try {
      const roomData = insertRoomSchema.parse(req.body);
      const newRoom = await storage.createRoom(roomData);
      
      // Add creator as a host
      await storage.addParticipantToRoom({
        roomId: newRoom.id,
        userId: roomData.createdBy,
        role: 'host',
        isMuted: false
      });
      
      res.status(201).json(newRoom);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create room" });
    }
  });

  // End a room
  app.patch("/api/rooms/:id/end", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid room ID" });
    }

    try {
      const room = await storage.endRoom(id);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      
      res.json(room);
    } catch (error) {
      res.status(500).json({ message: "Failed to end room" });
    }
  });

  // ========== Room Participants Routes ==========

  // Join a room
  app.post("/api/rooms/:roomId/participants", async (req, res) => {
    const roomId = parseInt(req.params.roomId);
    if (isNaN(roomId)) {
      return res.status(400).json({ message: "Invalid room ID" });
    }

    try {
      const participantData = insertRoomParticipantSchema.parse({
        ...req.body,
        roomId
      });
      
      const participant = await storage.addParticipantToRoom(participantData);
      res.status(201).json(participant);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to join room" });
    }
  });

  // Leave a room
  app.delete("/api/rooms/:roomId/participants/:userId", async (req, res) => {
    const roomId = parseInt(req.params.roomId);
    const userId = parseInt(req.params.userId);
    
    if (isNaN(roomId) || isNaN(userId)) {
      return res.status(400).json({ message: "Invalid room ID or user ID" });
    }

    try {
      await storage.removeParticipantFromRoom(roomId, userId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to leave room" });
    }
  });

  // Update participant (mute/unmute, change role)
  app.patch("/api/rooms/:roomId/participants/:userId", async (req, res) => {
    const roomId = parseInt(req.params.roomId);
    const userId = parseInt(req.params.userId);
    
    if (isNaN(roomId) || isNaN(userId)) {
      return res.status(400).json({ message: "Invalid room ID or user ID" });
    }

    try {
      const updateSchema = z.object({
        role: z.enum(['host', 'speaker', 'listener']).optional(),
        isMuted: z.boolean().optional(),
        isSpeaking: z.boolean().optional()
      });
      
      const updateData = updateSchema.parse(req.body);
      const participant = await storage.updateParticipant(roomId, userId, updateData);
      
      if (!participant) {
        return res.status(404).json({ message: "Participant not found" });
      }
      
      res.json(participant);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to update participant" });
    }
  });

  return httpServer;
}
