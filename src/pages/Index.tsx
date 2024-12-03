import { useState } from "react";
import { FamilyEvent } from "@/types/event";
import { AddEventDialog } from "@/components/AddEventDialog";
import { EventCard } from "@/components/EventCard";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

const Index = () => {
  const [events, setEvents] = useState<FamilyEvent[]>([]);
  const { toast } = useToast();
  const [isUpcomingOpen, setIsUpcomingOpen] = useState(false);
  const [isPastOpen, setIsPastOpen] = useState(false);

  const addEvent = (newEvent: Omit<FamilyEvent, "id" | "createdAt">) => {
    const event: FamilyEvent = {
      ...newEvent,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setEvents((prev) => [...prev, event]);
    toast({
      title: "Event added",
      description: "Your event has been successfully added to the calendar.",
    });
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
    toast({
      title: "Event deleted",
      description: "Your event has been successfully removed from the calendar.",
    });
  };

  const todayEvents = events.filter(
    (event) => format(new Date(event.date), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
  );

  const upcomingEvents = events
    .filter((event) => new Date(event.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastEvents = events
    .filter((event) => new Date(event.date) < new Date())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen bg-[#F2F2F7]">
      <div className="container max-w-2xl py-8 px-4 md:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-[#1C1C1E] tracking-tight">Family Calendar</h1>
          <AddEventDialog onAddEvent={addEvent} />
        </div>

        {/* Today's Events */}
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold text-[#1C1C1E]">Today's Events</h2>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            {todayEvents.length === 0 ? (
              <p className="text-[#8E8E93] text-center py-4">No events scheduled for today</p>
            ) : (
              <div className="space-y-3">
                {todayEvents.map((event) => (
                  <EventCard key={event.id} event={event} onDelete={deleteEvent} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Events Collapsible */}
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
                  <EventCard key={event.id} event={event} onDelete={deleteEvent} />
                ))}
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>

        {/* Past Events Collapsible */}
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
                  <EventCard key={event.id} event={event} onDelete={deleteEvent} />
                ))}
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default Index;