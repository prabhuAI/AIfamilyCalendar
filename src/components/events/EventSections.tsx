import { FamilyEvent } from "@/types/event";
import { AIEventsDialog } from "../ai-events/AIEventsDialog";
import { EventList } from "./EventList";
import { EventSection } from "./EventSection";

interface EventSectionsProps {
  todayEvents: FamilyEvent[];
  upcomingEvents: FamilyEvent[];
  pastEvents: FamilyEvent[];
  isUpcomingOpen: boolean;
  isPastOpen: boolean;
  setIsUpcomingOpen: (value: boolean) => void;
  setIsPastOpen: (value: boolean) => void;
  onDelete: (id: string) => void;
  onAddEvent: (event: any) => void;
}

export function EventSections({
  todayEvents,
  upcomingEvents,
  pastEvents,
  isUpcomingOpen,
  isPastOpen,
  setIsUpcomingOpen,
  setIsPastOpen,
  onDelete,
  onAddEvent,
}: EventSectionsProps) {
  return (
    <div className="space-y-2">
      {/* AI Events Button */}
      <div className="mb-2">
        <AIEventsDialog onAddEvent={onAddEvent} />
      </div>

      {/* Today's Events */}
      <div className="space-y-2 mb-2">
        <h2 className="text-lg font-semibold text-[#1C1C1E]">Today's Events</h2>
        <div className="bg-white rounded-xl p-3 shadow-sm">
          <EventList
            events={todayEvents}
            onDelete={onDelete}
            emptyMessage="No events scheduled for today"
          />
        </div>
      </div>

      {/* Upcoming Events */}
      <EventSection
        title="Upcoming Events"
        events={upcomingEvents}
        isOpen={isUpcomingOpen}
        onOpenChange={setIsUpcomingOpen}
        onDelete={onDelete}
        emptyMessage="No upcoming events"
      />

      {/* Past Events */}
      <EventSection
        title="Past Events"
        events={pastEvents}
        isOpen={isPastOpen}
        onOpenChange={setIsPastOpen}
        onDelete={onDelete}
        emptyMessage="No past events"
      />
    </div>
  );
}