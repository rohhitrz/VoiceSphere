# VoiceSphere 🎙️

![VoiceSphere Banner](generated-icon.png)

VoiceSphere is a modern, responsive voice-based social networking platform inspired by apps like Clubhouse and Twitter Spaces. This frontend-only application simulates a rich, interactive audio chat experience with no backend dependencies.

## 🌟 Features

### Core Features
- **Browse Voice Rooms**: Explore active voice chat rooms filtered by topics
- **Join Voice Conversations**: Enter rooms and listen to ongoing discussions
- **Speak in Rooms**: Request to speak by raising your hand
- **Create New Rooms**: Start your own voice room on any topic
- **Interactive Audio Simulation**: Realistic audio chat simulation with visual speaking indicators
- **Dark/Light Mode**: Fully themed UI that works in both dark and light modes

### User Experience
- **Responsive Design**: Seamless experience across mobile, tablet, and desktop
- **Animated UI**: Smooth transitions and micro-interactions
- **Real-time Updates**: Simulated real-time updates for speakers and listeners
- **Search Functionality**: Find rooms by name or topic

### Audio Features
- **Mute/Unmute**: Control your microphone status
- **Raise Hand**: Request to become a speaker
- **Visual Speaker Indicators**: See who is currently speaking
- **Simulated Audio**: Web Audio API integration for simulated voice chat

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/voicesphere.git
cd voicesphere
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 💻 Tech Stack

- **React**: UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn UI**: Component library
- **React Query**: Data fetching and state management
- **Web Audio API**: Audio simulation
- **Wouter**: Lightweight routing
- **Lucide React**: Icon library

## 📱 Pages & Components

### Pages
- **Home**: Browse and discover voice rooms
- **Room**: Join a voice conversation room with speakers and listeners
- **Not Found**: 404 page

### Key Components
- **RoomCard**: Preview card for voice rooms
- **RoomList**: Grid display of available rooms
- **SpeakersList**: Shows active speakers in a room
- **ListenersList**: Shows listeners in a room
- **RoomControls**: Audio controls for mute, speak, and raise hand
- **Header**: Main navigation and search
- **MobileNav**: Bottom navigation for mobile devices

## 🧠 Architecture

The application utilizes a component-based architecture with:

- **Mock API Services**: Simulates backend interactions
- **React Query**: Handles data fetching and caching
- **Context API**: Manages global state like theme
- **Custom Hooks**: Encapsulates functionality like audio handling

## ⚙️ Configuration

The application supports theming via the `theme.json` file which controls:
- Primary color
- Appearance (dark/light)
- Border radius

## 🎯 Limitations

As this is a frontend-only demo:

- **No Persistence**: Data resets when the page is refreshed
- **Simulated Audio**: Real audio transmitting between users is not implemented
- **Mock Authentication**: No real user authentication

## 🛣️ Roadmap

Future enhancements could include:
- Integration with a real backend
- WebRTC for real audio transmission
- User authentication
- Recording and playback of conversations
- Direct messaging between users

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- Design inspiration from Clubhouse and Twitter Spaces
- Shadcn UI for beautiful components
- The React community for amazing tools and libraries

---

Created for Hackathon 2024 | [Contact Me](mailto:your-email@example.com)
