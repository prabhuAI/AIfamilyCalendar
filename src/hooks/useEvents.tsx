import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { FamilyEvent } from "@/types/event";
import { isToday, isFuture, isPast } from "date-fns";

// Helper function to fetch user
const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!user) throw new Error('No user found');
  return user;
};

// Helper function to map database events to FamilyEvent type
const mapDatabaseEventToFamilyEvent = (event: any): FamilyEvent => ({
  id: event.id,
  title: event.event_name,
  description: event.event_description || '',
  date: new Date(event.start_time),
  endDate: new Date(event.end_time),
  createdAt: new Date(event.created_at || Date.now())
});

// Helper function to fetch events from database
const fetchEvents = async (familyId: string) => {
  const user = await getCurrentUser();
  
  const { data, error } = await supabase
    .from('family_calendar')
    .select('*')
    .eq('family_id', familyId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error fetching events:', error);
    throw error;
  }

  return (data || []).map(mapDatabaseEventToFamilyEvent);
};

// Helper function to filter events by time
const filterEventsByTime = (events: FamilyEvent[]) => {
  const todayEvents = events.filter(event => isToday(event.date));
  const upcomingEvents = events
    .filter(event => isFuture(event.date) && !isToday(event.date))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  const pastEvents = events
    .filter(event => isPast(event.date) && !isToday(event.date))
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  return { todayEvents, upcomingEvents, pastEvents };
};

export const useEvents = (familyId: string | null) => {
  const { data: events = [], refetch } = useQuery({
    queryKey: ['events', familyId],
    queryFn: () => familyId ? fetchEvents(familyId) : Promise.resolve([]),
    enabled: !!familyId,
    refetchInterval: 5000
  });

  const addEvent = async (newEvent: any) => {
    try {
      const user = await getCurrentUser();
      if (!familyId) throw new Error('No family ID available');

      const eventData = {
        family_id: familyId,
        event_name: newEvent.title,
        event_description: newEvent.description || '',
        start_time: newEvent.date.toISOString(),
        end_time: newEvent.endDate?.toISOString() || newEvent.date.toISOString(),
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('family_calendar')
        .insert([eventData])
        .select()
        .single();

      if (error) throw error;

      refetch();
      toast({
        title: "Event added",
        description: "Your event has been successfully added to the calendar.",
      });
    } catch (error: any) {
      console.error('Error adding event:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('family_calendar')
        .delete()
        .eq('id', id);

      if (error) throw error;

      refetch();
      toast({
        title: "Event deleted",
        description: "Your event has been successfully removed from the calendar.",
      });
    } catch (error: any) {
      console.error('Error deleting event:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const { todayEvents, upcomingEvents, pastEvents } = filterEventsByTime(events);

  return {
    events,
    todayEvents,
    upcomingEvents,
    pastEvents,
    addEvent,
    deleteEvent
  };
};