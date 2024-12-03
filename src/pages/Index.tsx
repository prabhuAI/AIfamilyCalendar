import { useState } from "react";
import { FamilyEvent } from "@/types/event";
import { AddEventDialog } from "@/components/AddEventDialog";
import { EventCard } from "@/components/EventCard";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [events, setEvents] = useState<FamilyEvent[]>([]);
  const { toast } = useToast();

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
      <div className="container py-8 px-4 md:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-[#1C1C1E] tracking-tight">Family Calendar</h1>
          <AddEventDialog onAddEvent={addEvent} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Events */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[#1C1C1E] mb-4">Today's Events</h2>
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

          {/* Upcoming Events */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[#1C1C1E] mb-4">Upcoming Events</h2>
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              {upcomingEvents.length === 0 ? (
                <p className="text-[#8E8E93] text-center py-4">No upcoming events</p>
              ) : (
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <EventCard key={event.id} event={event} onDelete={deleteEvent} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Past Events */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[#1C1C1E] mb-4">Past Events</h2>
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              {pastEvents.length === 0 ? (
                <p className="text-[#8E8E93] text-center py-4">No past events</p>
              ) : (
                <div className="space-y-3">
                  {pastEvents.map((event) => (
                    <EventCard key={event.id} event={event} onDelete={deleteEvent} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;