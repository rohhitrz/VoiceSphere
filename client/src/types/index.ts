export interface User {
  id: number;
  name: string;
  username: string;
  avatarUrl: string;
  isSpeaking?: boolean;
  isMuted?: boolean;
  role?: 'host' | 'speaker' | 'listener';
  isYou?: boolean;
}

export interface Room {
  id: number;
  name: string;
  topic: string;
  description?: string;
  isLive: boolean;
  startedAt: string;
  participantCount: number;
  speakers: User[];
  listeners: User[];
}

export type Topic = 'All' | 'Tech' | 'Music' | 'Art' | 'Business' | 'Social' | 'Education' | 'Gaming';
