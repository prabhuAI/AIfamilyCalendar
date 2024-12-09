import { FamilyEvent } from "@/types/event";
import { EventCard } from "@/components/EventCard";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { AIEventsDialog } from "./AIEventsDialog";

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
    <div className="space-y-3 md:space-y-4">
      {/* Today's Events */}
      <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
        <h2 className="text-lg md:text-xl font-semibold text-[#1C1C1E]">Today's Events</h2>
        <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 shadow-sm">
          {todayEvents.length === 0 ? (
            <p className="text-[#8E8E93] text-center py-3 md:py-4 text-sm md:text-base">No events scheduled for today</p>
          ) : (
            <div className="space-y-2 md:space-y-3">
              {todayEvents.map((event) => (
                <EventCard key={event.id} event={event} onDelete={onDelete} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Events */}
      <Collapsible
        open={isUpcomingOpen}
        onOpenChange={setIsUpcomingOpen}
        className="mb-3 md:mb-4 bg-white rounded-xl md:rounded-2xl shadow-sm overflow-hidden"
      >
        <CollapsibleTrigger className="flex justify-between items-center w-full p-3 md:p-4 text-left">
          <h2 className="text-lg md:text-xl font-semibold text-[#1C1C1E]">Upcoming Events</h2>
          <ChevronDown className={`h-5 w-5 text-[#8E8E93] transition-transform duration-200 ${isUpcomingOpen ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="px-3 pb-3 md:px-4 md:pb-4">
          {upcomingEvents.length === 0 ? (
            <p className="text-[#8E8E93] text-center py-3 md:py-4 text-sm md:text-base">No upcoming events</p>
          ) : (
            <div className="space-y-2 md:space-y-3">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} onDelete={onDelete} />
              ))}
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Past Events */}
      <Collapsible
        open={isPastOpen}
        onOpenChange={setIsPastOpen}
        className="bg-white rounded-xl md:rounded-2xl shadow-sm overflow-hidden"
      >
        <CollapsibleTrigger className="flex justify-between items-center w-full p-3 md:p-4 text-left">
          <h2 className="text-lg md:text-xl font-semibold text-[#1C1C1E]">Past Events</h2>
          <ChevronDown className={`h-5 w-5 text-[#8E8E93] transition-transform duration-200 ${isPastOpen ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="px-3 pb-3 md:px-4 md:pb-4">
          {pastEvents.length === 0 ? (
            <p className="text-[#8E8E93] text-center py-3 md:py-4 text-sm md:text-base">No past events</p>
          ) : (
            <div className="space-y-2 md:space-y-3">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} onDelete={onDelete} />
              ))}
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* AI Events Button */}
      <AIEventsDialog onAddEvent={onAddEvent} />
    </div>
  );
}