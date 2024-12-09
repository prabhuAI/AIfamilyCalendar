import { Card } from "@/components/ui/card";
import { FamilyEvent } from "@/types/event";
import { EventCardHeader } from "./EventCardHeader";
import { EventCardContent } from "./EventCardContent";

interface EventCardProps {
  event: FamilyEvent;
  onDelete: (id: string) => void;
}

export function EventCard({ event, onDelete }: EventCardProps) {
  return (
    <Card className="animate-fade-in bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden">
      <EventCardHeader 
        title={event.title} 
        onDelete={() => onDelete(event.id)} 
      />
      <EventCardContent 
        date={event.date}
        description={event.description}
      />
    </Card>
  );
}