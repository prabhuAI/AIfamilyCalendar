import { useState } from "react";
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
      <EventSection
        title="Today's Events"
        events={todayEvents}
        isOpen={false}
        onOpenChange={() => {}}
        onDelete={onDelete}
        emptyMessage="No events scheduled for today"
      />

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