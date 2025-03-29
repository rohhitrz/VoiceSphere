import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type SpeakingIntensity = 'slight' | 'medium' | 'intense';

interface SpeakingIndicatorProps {
  isSpeaking?: boolean;
  className?: string;
  intensity?: SpeakingIntensity;
}

export const SpeakingIndicator = ({ 
  isSpeaking = true, 
  className,
  intensity: initialIntensity = 'medium'
}: SpeakingIndicatorProps) => {
  const [intensity, setIntensity] = useState<SpeakingIntensity>(initialIntensity);
  
  // Randomly change speaking intensity for a more natural effect
  useEffect(() => {
    if (!isSpeaking) return;
    
    const intensities: SpeakingIntensity[] = ['slight', 'medium', 'intense'];
    
    // Initial random delay before changing intensity
    const initialDelay = Math.random() * 2000 + 1000; // 1-3 seconds
    
    const intensityChangeTimer = setTimeout(() => {
      const changeIntensity = () => {
        // Don't change to the same intensity
        const currentIndex = intensities.indexOf(intensity);
        const availableIntensities = intensities.filter((_, i) => i !== currentIndex);
        const randomIndex = Math.floor(Math.random() * availableIntensities.length);
        const newIntensity = availableIntensities[randomIndex];
        
        setIntensity(newIntensity);
        
        // Set next change with random delay
        const delay = Math.random() * 3000 + 1000; // 1-4 seconds
        setTimeout(changeIntensity, delay);
      };
      
      changeIntensity();
    }, initialDelay);
    
    return () => clearTimeout(intensityChangeTimer);
  }, [isSpeaking, intensity]);
  
  if (!isSpeaking) return null;
  
  return (
    <div 
      className={cn(
        "absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-background",
        "bg-green-500 animate-pulse",
        `speaking-${intensity}`,
        className
      )} 
    />
  );
};
