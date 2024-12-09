import { FamilyEvent } from "@/types/event";
import { EventList } from "./EventList";

interface TodayEventsProps {
  events: FamilyEvent[];
  onDelete: (id: string) => void;
}

export function TodayEvents({ events, onDelete }: TodayEventsProps) {
  return (
    <div className="space-y-2 mb-4">
      <h2 className="text-lg font-semibold text-[#4169E1]">Today's Events</h2>
      <div className="bg-white/80 backdrop-blur-sm rounded-[24px] p-4 shadow-lg border border-white/20">
        <EventList
          events={events}
          onDelete={onDelete}
          emptyMessage="No events scheduled for today"
        />
      </div>
    </div>
  );
}