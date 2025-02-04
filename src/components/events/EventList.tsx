import { FamilyEvent } from "@/types/event";
import { EventCard } from "./EventCard";

interface EventListProps {
  events: FamilyEvent[];
  onDelete: (id: string) => void;
  emptyMessage?: string;
}

export function EventList({ events, onDelete, emptyMessage = "No events" }: EventListProps) {
  if (events.length === 0) {
    return (
      <p className="text-gray-500 text-center py-4 text-sm">{emptyMessage}</p>
    );
  }

  return (
    <div className="space-y-2">
      {events.map((event) => (
        <EventCard key={event.id} event={event} onDelete={onDelete} />
      ))}
    </div>
  );
}