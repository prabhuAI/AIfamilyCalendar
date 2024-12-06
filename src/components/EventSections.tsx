import { FamilyEvent } from "@/types/event";
import { EventCard } from "@/components/EventCard";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

interface EventSectionsProps {
  todayEvents: FamilyEvent[];
  upcomingEvents: FamilyEvent[];
  pastEvents: FamilyEvent[];
  isUpcomingOpen: boolean;
  isPastOpen: boolean;
  setIsUpcomingOpen: (value: boolean) => void;
  setIsPastOpen: (value: boolean) => void;
  onDelete: (id: string) => void;
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
}: EventSectionsProps) {
  return (
    <div className="space-y-4">
      {/* Today's Events */}
      <div className="space-y-4 mb-8">
        <h2 className="text-xl font-semibold text-[#1C1C1E]">Today's Events</h2>
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          {todayEvents.length === 0 ? (
            <p className="text-[#8E8E93] text-center py-4">No events scheduled for today</p>
          ) : (
            <div className="space-y-3">
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
        className="mb-4 bg-white rounded-2xl shadow-sm overflow-hidden"
      >
        <CollapsibleTrigger className="flex justify-between items-center w-full p-4 text-left">
          <h2 className="text-xl font-semibold text-[#1C1C1E]">Upcoming Events</h2>
          <ChevronDown className={`h-5 w-5 text-[#8E8E93] transition-transform duration-200 ${isUpcomingOpen ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 pb-4">
          {upcomingEvents.length === 0 ? (
            <p className="text-[#8E8E93] text-center py-4">No upcoming events</p>
          ) : (
            <div className="space-y-3">
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
        className="bg-white rounded-2xl shadow-sm overflow-hidden"
      >
        <CollapsibleTrigger className="flex justify-between items-center w-full p-4 text-left">
          <h2 className="text-xl font-semibold text-[#1C1C1E]">Past Events</h2>
          <ChevronDown className={`h-5 w-5 text-[#8E8E93] transition-transform duration-200 ${isPastOpen ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 pb-4">
          {pastEvents.length === 0 ? (
            <p className="text-[#8E8E93] text-center py-4">No past events</p>
          ) : (
            <div className="space-y-3">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} onDelete={onDelete} />
              ))}
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}