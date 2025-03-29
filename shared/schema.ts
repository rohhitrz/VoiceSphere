// import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
// import { createInsertSchema } from "drizzle-zod";
// import { z } from "zod";

// // User schema
// export const users = pgTable("users", {
//   id: serial("id").primaryKey(),
//   username: text("username").notNull().unique(),
//   password: text("password").notNull(),
//   name: text("name").notNull(),
//   avatarUrl: text("avatar_url"),
//   createdAt: timestamp("created_at").defaultNow().notNull(),
// });

// // Room schema
// export const rooms = pgTable("rooms", {
//   id: serial("id").primaryKey(),
//   name: text("name").notNull(),
//   topic: text("topic").notNull(),
//   description: text("description"),
//   isLive: boolean("is_live").default(true).notNull(),
//   createdBy: integer("created_by").references(() => users.id).notNull(),
//   startedAt: timestamp("started_at").defaultNow().notNull(),
//   createdAt: timestamp("created_at").defaultNow().notNull(),
// });

// // Room participants schema
// export const roomParticipants = pgTable("room_participants", {
//   id: serial("id").primaryKey(),
//   roomId: integer("room_id").references(() => rooms.id).notNull(),
//   userId: integer("user_id").references(() => users.id).notNull(),
//   role: text("role").notNull(), // 'host', 'speaker', 'listener'
//   isMuted: boolean("is_muted").default(false).notNull(),
//   isSpeaking: boolean("is_speaking").default(false),
//   joinedAt: timestamp("joined_at").defaultNow().notNull(),
// });

// // Insert schemas
// export const insertUserSchema = createInsertSchema(users).pick({
//   username: true,
//   password: true,
//   name: true,
//   avatarUrl: true,
// });

// export const insertRoomSchema = createInsertSchema(rooms).pick({
//   name: true,
//   topic: true,
//   description: true,
//   createdBy: true,
// });

// export const insertRoomParticipantSchema = createInsertSchema(roomParticipants).pick({
//   roomId: true,
//   userId: true,
//   role: true,
//   isMuted: true,
// });

// // Export types
// export type InsertUser = z.infer<typeof insertUserSchema>;
// export type User = typeof users.$inferSelect;

// export type InsertRoom = z.infer<typeof insertRoomSchema>;
// export type Room = typeof rooms.$inferSelect;

// export type InsertRoomParticipant = z.infer<typeof insertRoomParticipantSchema>;
// export type RoomParticipant = typeof roomParticipants.$inferSelect;
