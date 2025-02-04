import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { FamilyEvent } from "@/types/event";
import { isToday, startOfDay, endOfDay, isAfter, isBefore, isSameDay } from "date-fns";
import { Database } from "@/integrations/supabase/types";

type Event = Database['public']['Tables']['family_calendar']['Row'];

const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!user) throw new Error('No user found');
  return user;
};

const mapDatabaseEventToFamilyEvent = (event: Event): FamilyEvent => ({
  id: event.id,
  title: event.event_name,
  description: event.event_description || '',
  date: new Date(event.start_time),
  endDate: new Date(event.end_time),
  createdAt: new Date(event.created_at)
});

const fetchEvents = async () => {
  console.log('Starting fetchEvents...');
  const user = await getCurrentUser();
  console.log('Current user:', user.id);

  const { data, error } = await supabase
    .from('family_calendar')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    console.error('Error fetching events:', error);
    throw error;
  }

  console.log('Fetched events:', data);
  return (data || []).map(mapDatabaseEventToFamilyEvent);
};

const filterEventsByTime = (events: FamilyEvent[]) => {
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);

  console.log('Filtering events. Current time:', now);

  // Filter and sort today's events by time
  const todayEvents = events
    .filter(event => {
      const eventDate = new Date(event.date);
      const isEventToday = isSameDay(eventDate, now);
      console.log('Event:', event.title, 'Date:', eventDate, 'Is Today:', isEventToday);
      return isEventToday;
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  // Filter and sort upcoming events chronologically
  const upcomingEvents = events
    .filter(event => {
      const eventDate = new Date(event.date);
      const isUpcoming = isAfter(eventDate, todayEnd);
      console.log('Event:', event.title, 'Date:', eventDate, 'Is Upcoming:', isUpcoming);
      return isUpcoming;
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime()); // Sort by date ascending

  // Filter and sort past events reverse chronologically (most recent first)
  const pastEvents = events
    .filter(event => {
      const eventDate = new Date(event.date);
      const isPast = isBefore(eventDate, todayStart) && !isSameDay(eventDate, now);
      console.log('Event:', event.title, 'Date:', eventDate, 'Is Past:', isPast);
      return isPast;
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime()); // Sort by date descending

  console.log('Filtered and sorted events:', {
    today: todayEvents.length,
    upcoming: upcomingEvents.length,
    past: pastEvents.length
  });

  return { todayEvents, upcomingEvents, pastEvents };
};

export const useEvents = () => {
  const { data: events = [], refetch } = useQuery({
    queryKey: ['events'],
    queryFn: () => fetchEvents(),
    refetchInterval: 5000
  });

  const addEvent = async (newEvent: any) => {
    try {
      const user = await getCurrentUser();

      const eventData = {
        user_id: user.id,
        event_name: newEvent.title,
        event_description: newEvent.description || '',
        start_time: newEvent.date.toISOString(),
        end_time: newEvent.endDate?.toISOString() || newEvent.date.toISOString(),
      };

      console.log('Adding event with data:', eventData);

      const { data, error } = await supabase
        .from('family_calendar')
        .insert([eventData])
        .select()
        .single();

      if (error) {
        console.error('Error adding event:', error);
        throw error;
      }

      console.log('Successfully added event:', data);
      refetch();
      toast({
        title: "Event added",
        description: "Your event has been successfully added to the calendar.",
      });
    } catch (error: any) {
      console.error('Error in addEvent:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const user = await getCurrentUser();
      console.log('Deleting event:', id, 'for user:', user.id);

      const { error } = await supabase
        .from('family_calendar')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting event:', error);
        throw error;
      }

      console.log('Successfully deleted event:', id);
      refetch();
      toast({
        title: "Event deleted",
        description: "Your event has been successfully removed from the calendar.",
      });
    } catch (error: any) {
      console.error('Error in deleteEvent:', error);
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