import { cn } from "@/lib/utils";

interface SpeakingIndicatorProps {
  isSpeaking: boolean;
  className?: string;
}

export const SpeakingIndicator = ({ isSpeaking, className }: SpeakingIndicatorProps) => {
  if (!isSpeaking) return null;
  
  return (
    <div className={cn(
      "absolute inset-0 rounded-full speaking-indicator",
      className
    )} />
  );
};
