import { Topic } from "@/types";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface TopicFilterProps {
  topics: Topic[];
  currentTopic: Topic;
  onTopicChange: (topic: Topic) => void;
}

export const TopicFilter = ({ 
  topics, 
  currentTopic,
  onTopicChange 
}: TopicFilterProps) => {
  return (
    <>
      {/* Desktop view */}
      <div className="hidden md:flex space-x-2">
        {topics.map((topic) => (
          <Button
            key={topic}
            variant="ghost"
            onClick={() => onTopicChange(topic)}
            className={`
              px-3 py-1 rounded-full text-sm transition
              ${currentTopic === topic 
                ? 'bg-primary/20 text-primary' 
                : 'bg-dark-surface hover:bg-dark-border text-white'
              }
            `}
          >
            {topic}
          </Button>
        ))}
      </div>

      {/* Mobile view */}
      <Select
        defaultValue={currentTopic}
        onValueChange={(value) => onTopicChange(value as Topic)}
        className="md:hidden"
      >
        <SelectTrigger className="bg-dark-surface border border-dark-border rounded-full px-3 py-1 text-sm w-32">
          <SelectValue placeholder="All Topics" />
        </SelectTrigger>
        <SelectContent>
          {topics.map((topic) => (
            <SelectItem key={topic} value={topic}>
              {topic}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};
