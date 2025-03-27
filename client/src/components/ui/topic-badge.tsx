import { Topic } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TopicBadgeProps {
  topic: Topic;
  className?: string;
  isLive?: boolean;
}

export const TopicBadge = ({ topic, className, isLive = false }: TopicBadgeProps) => {
  return (
    <div className={cn("flex items-center", className)}>
      {isLive && (
        <span className="inline-block bg-red-500 h-2 w-2 rounded-full mr-2 animate-pulse"></span>
      )}
      <Badge variant="outline" className="text-xs font-normal bg-dark-surface text-gray-400 border-none px-2 py-0.5 rounded-full">
        {topic}
      </Badge>
    </div>
  );
};
