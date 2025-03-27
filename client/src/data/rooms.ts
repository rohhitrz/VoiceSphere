import { Room, Topic } from "@/types";
import { users } from "./users";

// Helper function to get random users as speakers
const getRandomSpeakers = (count: number) => {
  return users
    .filter(user => user.id <= 10 && !user.isYou) // Just to make sure we get consistent users for speakers
    .slice(0, count);
};

// Helper function to get random users as listeners
const getRandomListeners = (count: number) => {
  const youUser = users.find(user => user.isYou);
  return [
    ...(youUser ? [youUser] : []),
    ...users
      .filter(user => user.id > 10 && !user.isYou)
      .slice(0, count - (youUser ? 1 : 0))
  ];
};

export const rooms: Room[] = [
  {
    id: 1,
    name: "The Future of AI and Voice Technology",
    topic: "Tech",
    description: "Join tech leaders discussing the latest trends in AI voice recognition, LLMs, and what's next for conversational interfaces.",
    isLive: true,
    startedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
    participantCount: 145,
    speakers: [
      { ...users[0], role: "host", isSpeaking: true, isMuted: false },
      { ...users[1], role: "speaker", isSpeaking: false, isMuted: true },
      { ...users[2], role: "speaker", isSpeaking: false, isMuted: false },
      { ...users[3], role: "speaker", isSpeaking: true, isMuted: false }
    ],
    listeners: getRandomListeners(141)
  },
  {
    id: 2,
    name: "Web3 and the Future of Decentralized Apps",
    topic: "Tech",
    description: "Discussing the latest developments in Web3 technologies and how they're shaping the future of decentralized applications.",
    isLive: true,
    startedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    participantCount: 42,
    speakers: [
      { ...users[3], role: "host", isSpeaking: true, isMuted: false },
      { ...users[2], role: "speaker", isSpeaking: false, isMuted: false },
      { ...users[8], role: "speaker", isSpeaking: false, isMuted: false }
    ],
    listeners: getRandomListeners(39)
  },
  {
    id: 3,
    name: "Indie Artists Spotlight Session",
    topic: "Music",
    description: "Showcasing independent musicians and discussing paths to success in the digital music landscape.",
    isLive: true,
    startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    participantCount: 86,
    speakers: [
      { ...users[14], role: "host", isSpeaking: true, isMuted: false },
      { ...users[15], role: "speaker", isSpeaking: false, isMuted: false },
      { ...users[9], role: "speaker", isSpeaking: false, isMuted: true },
      { ...users[8], role: "speaker", isSpeaking: false, isMuted: false },
      { ...users[7], role: "speaker", isSpeaking: false, isMuted: false },
      { ...users[6], role: "speaker", isSpeaking: false, isMuted: false }
    ],
    listeners: getRandomListeners(80)
  },
  {
    id: 4,
    name: "Startup Funding Strategies 2023",
    topic: "Business",
    description: "Expert investors and founders share insights on securing funding in today's challenging market.",
    isLive: true,
    startedAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(), // 35 minutes ago
    participantCount: 64,
    speakers: [
      { ...users[12], role: "host", isSpeaking: false, isMuted: false },
      { ...users[13], role: "speaker", isSpeaking: true, isMuted: false },
      { ...users[18], role: "speaker", isSpeaking: false, isMuted: false }
    ],
    listeners: getRandomListeners(61)
  },
  {
    id: 5,
    name: "Friday Night Chill & Chat",
    topic: "Social",
    description: "Casual conversation about anything and everything. Come hang out and make new friends!",
    isLive: true,
    startedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
    participantCount: 112,
    speakers: [
      { ...users[7], role: "host", isSpeaking: true, isMuted: false },
      { ...users[10], role: "speaker", isSpeaking: false, isMuted: false },
      { ...users[11], role: "speaker", isSpeaking: false, isMuted: true },
      { ...users[12], role: "speaker", isSpeaking: false, isMuted: false },
      { ...users[13], role: "speaker", isSpeaking: false, isMuted: false },
      { ...users[14], role: "speaker", isSpeaking: false, isMuted: false },
      { ...users[15], role: "speaker", isSpeaking: false, isMuted: false },
      { ...users[16], role: "speaker", isSpeaking: false, isMuted: false },
      { ...users[17], role: "speaker", isSpeaking: false, isMuted: false }
    ],
    listeners: getRandomListeners(103)
  },
  {
    id: 6,
    name: "Digital Art Techniques Workshop",
    topic: "Art",
    description: "Professional digital artists share techniques, tools, and tips for creating stunning digital art.",
    isLive: true,
    startedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    participantCount: 53,
    speakers: [
      { ...users[8], role: "host", isSpeaking: false, isMuted: false },
      { ...users[9], role: "speaker", isSpeaking: true, isMuted: false },
      { ...users[10], role: "speaker", isSpeaking: false, isMuted: false }
    ],
    listeners: getRandomListeners(50)
  },
  {
    id: 7,
    name: "React vs Vue: The Ultimate Showdown",
    topic: "Tech",
    description: "Developers debate the pros and cons of React and Vue frameworks for modern web development.",
    isLive: true,
    startedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(), // 20 minutes ago
    participantCount: 78,
    speakers: [
      { ...users[6], role: "host", isSpeaking: false, isMuted: false },
      { ...users[11], role: "speaker", isSpeaking: true, isMuted: false },
      { ...users[12], role: "speaker", isSpeaking: false, isMuted: true },
      { ...users[13], role: "speaker", isSpeaking: false, isMuted: false },
      { ...users[14], role: "speaker", isSpeaking: false, isMuted: false },
      { ...users[15], role: "speaker", isSpeaking: false, isMuted: false }
    ],
    listeners: getRandomListeners(72)
  }
];

export const featuredRoom = rooms[0];

export const getTopics = (): Topic[] => ['All', 'Tech', 'Music', 'Art', 'Business', 'Social', 'Education', 'Gaming'];

export const getRoomsByTopic = (topic: Topic): Room[] => {
  if (topic === 'All') {
    return rooms;
  }
  return rooms.filter(room => room.topic === topic);
};

export const getRoomById = (id: number): Room | undefined => {
  return rooms.find(room => room.id === id);
};
