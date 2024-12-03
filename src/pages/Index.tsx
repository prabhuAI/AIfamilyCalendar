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
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Family Calendar</h1>
          <AddEventDialog onAddEvent={addEvent} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Events */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">Today's Events</h2>
            {todayEvents.length === 0 ? (
              <p className="text-gray-500">No events scheduled for today</p>
            ) : (
              todayEvents.map((event) => (
                <EventCard key={event.id} event={event} onDelete={deleteEvent} />
              ))
            )}
          </div>

          {/* Upcoming Events */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">Upcoming Events</h2>
            {upcomingEvents.length === 0 ? (
              <p className="text-gray-500">No upcoming events</p>
            ) : (
              upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} onDelete={deleteEvent} />
              ))
            )}
          </div>

          {/* Past Events */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">Past Events</h2>
            {pastEvents.length === 0 ? (
              <p className="text-gray-500">No past events</p>
            ) : (
              pastEvents.map((event) => (
                <EventCard key={event.id} event={event} onDelete={deleteEvent} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;