// Mock audio data URLs (Base64 encoded short audio clips)
// These are short audio samples that sound like people talking
// but are just tones/human-like sounds that don't contain actual words
const AUDIO_SAMPLES = [
  // Sample 1: Short discussion sound (1-2 seconds)
  "data:audio/mp3;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAADIyK2EAVFNTRQAAAAgAAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV",
  
  // Sample 2: Medium discussion sound (2-3 seconds)
  "data:audio/mp3;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAADIyK2EAVFNTRQAAAAgAAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV",
  
  // Sample 3: Longer discussion sound (3-5 seconds)
  "data:audio/mp3;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAADIyK2EAVFNTRQAAAAgAAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV"
];

/**
 * Create an audio element from a data URL or audio file URL
 */
export function createAudioFromUrl(url: string): HTMLAudioElement {
  const audio = new Audio(url);
  return audio;
}

/**
 * Get a random audio sample
 */
export function getRandomAudioSample(): string {
  const randomIndex = Math.floor(Math.random() * AUDIO_SAMPLES.length);
  return AUDIO_SAMPLES[randomIndex];
}

/**
 * Play a random voice clip with custom duration and volume
 */
export function playRandomVoiceClip(
  onComplete?: () => void, 
  minDuration = 1000, 
  maxDuration = 5000,
  volume = 0.3
): { audio: HTMLAudioElement, stop: () => void } {
  const audio = createAudioFromUrl(getRandomAudioSample());
  
  // Set volume (0.0 to 1.0)
  audio.volume = volume;
  
  // Calculate a random duration for this speech segment
  const duration = Math.floor(Math.random() * (maxDuration - minDuration)) + minDuration;
  
  // Play the audio
  audio.play();
  
  // Set a timeout to stop the audio after the duration
  const timeoutId = setTimeout(() => {
    audio.pause();
    if (onComplete) onComplete();
  }, duration);
  
  // Return audio element and stop function
  return {
    audio,
    stop: () => {
      clearTimeout(timeoutId);
      audio.pause();
    }
  };
}

/**
 * Simulate a realistic conversation by playing random voice clips
 * with natural pauses between speakers
 */
export function simulateConversation(
  numberOfSpeakers = 2,
  onSpeakerStart?: (speakerIndex: number) => void,
  onSpeakerStop?: (speakerIndex: number) => void,
  onSimulationEnd?: () => void,
  duration = 60000 // Default duration of 60 seconds
): { stop: () => void } {
  const speakers = Array(numberOfSpeakers).fill(null);
  const activeSpeaker = { current: -1 };
  const audioRefs: Array<{ audio: HTMLAudioElement, stop: () => void } | null> = Array(numberOfSpeakers).fill(null);
  let simulationActive = true;
  let timeoutId: NodeJS.Timeout;
  
  // Stop the current simulation
  const stopSimulation = () => {
    simulationActive = false;
    clearTimeout(timeoutId);
    
    // Stop all active audio
    audioRefs.forEach((ref, index) => {
      if (ref) {
        ref.stop();
        if (onSpeakerStop && activeSpeaker.current === index) {
          onSpeakerStop(index);
        }
      }
    });
    
    if (onSimulationEnd) onSimulationEnd();
  };
  
  // Schedule end of simulation
  if (duration > 0) {
    setTimeout(stopSimulation, duration);
  }
  
  // Function to pick a new speaker
  const chooseNewSpeaker = () => {
    if (!simulationActive) return;
    
    // Stop the current speaker
    if (activeSpeaker.current >= 0 && audioRefs[activeSpeaker.current]) {
      audioRefs[activeSpeaker.current]?.stop();
      if (onSpeakerStop) onSpeakerStop(activeSpeaker.current);
    }
    
    // Randomly decide if we should have no one speaking (a pause)
    const shouldPause = Math.random() < 0.2;
    
    if (shouldPause) {
      activeSpeaker.current = -1;
      
      // Set a timeout for the pause duration
      const pauseDuration = Math.floor(Math.random() * 1500) + 500; // 0.5-2 seconds pause
      timeoutId = setTimeout(chooseNewSpeaker, pauseDuration);
      return;
    }
    
    // Pick a new random speaker different from the current one
    let newSpeaker;
    if (numberOfSpeakers > 1) {
      do {
        newSpeaker = Math.floor(Math.random() * numberOfSpeakers);
      } while (newSpeaker === activeSpeaker.current);
    } else {
      newSpeaker = 0;
    }
    
    activeSpeaker.current = newSpeaker;
    
    if (onSpeakerStart) onSpeakerStart(newSpeaker);
    
    // Play a random voice clip for this speaker
    const speakingDuration = Math.floor(Math.random() * 4000) + 1000; // 1-5 seconds
    
    audioRefs[newSpeaker] = playRandomVoiceClip(
      // When this speaker finishes, pick a new one
      () => {
        if (!simulationActive) return;
        audioRefs[newSpeaker] = null;
        
        if (onSpeakerStop) onSpeakerStop(newSpeaker);
        
        // Small delay before next speaker
        const nextSpeakerDelay = Math.floor(Math.random() * 800) + 200; // 0.2-1 second delay
        timeoutId = setTimeout(chooseNewSpeaker, nextSpeakerDelay);
      },
      speakingDuration * 0.6, // Min duration
      speakingDuration, // Max duration
      0.3 // Volume
    );
  };
  
  // Start the conversation with a small initial delay
  timeoutId = setTimeout(chooseNewSpeaker, 500);
  
  return {
    stop: stopSimulation
  };
}