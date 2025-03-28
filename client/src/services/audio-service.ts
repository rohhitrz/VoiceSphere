/**
 * This file provides audio simulation functionality for the voice chat room
 * using Web Audio API to generate simple tones that simulate speakers
 */

// Store oscillators and gain nodes for each speaker
interface AudioSource {
  oscillator: OscillatorNode | null;
  gainNode: GainNode | null;
  timeoutId: NodeJS.Timeout | null;
}

// Create audio context only on the client side (if available)
const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    return new (window.AudioContext || (window as any).webkitAudioContext)();
  } catch (e) {
    console.warn("Web Audio API not supported in this browser");
    return null;
  }
};

/**
 * Create and play a simulated voice sound
 * using the Web Audio API oscillator
 */
function createVoiceSound(
  frequency: number = 220 + Math.random() * 150,
  duration: number = 1500,
  volume: number = 0.15,
  onComplete?: () => void
): AudioSource | null {
  const ctx = getAudioContext();
  if (!ctx) return null;
  
  // Create an oscillator (tone generator)
  const oscillator = ctx.createOscillator();
  oscillator.type = "sine"; // sine wave - less harsh
  oscillator.frequency.value = frequency; // frequency in hertz
  
  // Create a gain node (volume control)
  const gainNode = ctx.createGain();
  gainNode.gain.value = 0; // Start at 0
  
  // Connect oscillator to gain node, then to audio output
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  // Fade in
  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.1);
  
  // Start the oscillator
  oscillator.start();
  
  // Randomize frequency slightly over time to simulate speech
  const numberOfChanges = 5;
  const intervalTime = duration / numberOfChanges;
  
  // Add random frequency modulation
  for (let i = 1; i <= numberOfChanges; i++) {
    setTimeout(() => {
      if (oscillator.frequency) {
        // Randomly adjust frequency slightly
        const variance = Math.random() * 50 - 25; // -25 to +25 Hz
        oscillator.frequency.value = frequency + variance;
      }
    }, intervalTime * i);
  }
  
  // Fade out before stopping
  gainNode.gain.setValueAtTime(volume, ctx.currentTime + (duration / 1000) - 0.2);
  gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + (duration / 1000));
  
  // Stop after duration
  const timeoutId = setTimeout(() => {
    oscillator.stop();
    if (onComplete) onComplete();
  }, duration);
  
  return {
    oscillator,
    gainNode,
    timeoutId
  };
}

/**
 * Stop a voice sound
 */
function stopVoiceSound(source: AudioSource | null) {
  if (!source) return;
  
  // Clear timeout
  if (source.timeoutId) {
    clearTimeout(source.timeoutId);
  }
  
  try {
    // Fade out quickly
    if (source.gainNode) {
      const ctx = getAudioContext();
      if (ctx) {
        source.gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);
      }
    }
    
    // Stop oscillator after fade-out
    setTimeout(() => {
      if (source.oscillator) {
        source.oscillator.stop();
      }
    }, 100);
  } catch (e) {
    // Ignore errors (oscillator might have already stopped)
  }
}

/**
 * Simulate a realistic conversation by generating
 * voice-like sounds with the Web Audio API
 */
export function simulateConversation(
  numberOfSpeakers = 2,
  onSpeakerStart?: (speakerIndex: number) => void,
  onSpeakerStop?: (speakerIndex: number) => void,
  onSimulationEnd?: () => void,
  duration = 60000 // Default duration of 60 seconds
): { stop: () => void } {
  // Initialize data structures
  const audioSources: (AudioSource | null)[] = Array(numberOfSpeakers).fill(null);
  let activeSpeaker = -1;
  let simulationActive = true;
  let timeoutId: NodeJS.Timeout | null = null;
  
  // Stop the current simulation
  const stopSimulation = () => {
    simulationActive = false;
    
    // Clear any pending timeouts
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    // Stop all active audio sources
    audioSources.forEach((source, index) => {
      if (source) {
        stopVoiceSound(source);
        if (onSpeakerStop && activeSpeaker === index) {
          onSpeakerStop(index);
        }
      }
    });
    
    if (onSimulationEnd) onSimulationEnd();
  };
  
  // Schedule end of simulation if duration is provided
  if (duration > 0) {
    setTimeout(stopSimulation, duration);
  }
  
  // The main function to simulate conversation
  const simulateSpeaking = () => {
    if (!simulationActive) return;
    
    // Stop current speaker if active
    if (activeSpeaker >= 0 && audioSources[activeSpeaker]) {
      stopVoiceSound(audioSources[activeSpeaker]);
      if (onSpeakerStop) onSpeakerStop(activeSpeaker);
      audioSources[activeSpeaker] = null;
    }
    
    // Decide whether to have a pause
    const shouldPause = Math.random() < 0.2;
    
    if (shouldPause) {
      activeSpeaker = -1;
      
      // Set a timeout for the pause duration
      const pauseDuration = Math.floor(Math.random() * 1000) + 500; // 0.5-1.5 seconds pause
      timeoutId = setTimeout(simulateSpeaking, pauseDuration);
      return;
    }
    
    // Pick a new speaker (different from current one if possible)
    let newSpeaker;
    if (numberOfSpeakers > 1) {
      do {
        newSpeaker = Math.floor(Math.random() * numberOfSpeakers);
      } while (newSpeaker === activeSpeaker);
    } else {
      newSpeaker = 0;
    }
    
    activeSpeaker = newSpeaker;
    
    // Notify that a speaker started
    if (onSpeakerStart) onSpeakerStart(newSpeaker);
    
    // Calculate speaking duration
    const speakingDuration = Math.floor(Math.random() * 2500) + 1500; // 1.5-4 seconds
    
    // Each speaker has a slightly different base frequency
    const baseSpeakerFrequency = 200 + (newSpeaker * 70);
    const speakerFrequency = baseSpeakerFrequency + Math.random() * 40 - 20;
    
    // Create voice sound for this speaker
    audioSources[newSpeaker] = createVoiceSound(
      speakerFrequency,
      speakingDuration,
      0.15, // volume
      () => {
        if (!simulationActive) return;
        
        // When this speaker finishes, clear reference
        audioSources[newSpeaker] = null;
        
        if (activeSpeaker === newSpeaker) {
          activeSpeaker = -1;
          if (onSpeakerStop) onSpeakerStop(newSpeaker);
        }
        
        // Small delay before next speaker
        const nextSpeakerDelay = Math.floor(Math.random() * 800) + 200; // 0.2-1 second delay
        timeoutId = setTimeout(simulateSpeaking, nextSpeakerDelay);
      }
    );
  };
  
  // Start the conversation with a small initial delay
  timeoutId = setTimeout(simulateSpeaking, 500);
  
  // Return stop function
  return {
    stop: stopSimulation
  };
}