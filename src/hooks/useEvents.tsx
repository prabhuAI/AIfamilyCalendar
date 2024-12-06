import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { FamilyEvent } from "@/types/event";
import { isToday, isFuture, isPast } from "date-fns";

export const useEvents = (familyId: string | null) => {
  const { data: events = [], refetch } = useQuery({
    queryKey: ['events', familyId],
    queryFn: async () => {
      if (!familyId) return [];
      
      console.log('Fetching events for family:', familyId);
      
      const { data, error } = await supabase
        .from('family_calendar')
        .select('*')
        .eq('family_id', familyId);
      
      if (error) {
        console.error('Error fetching events:', error);
        throw error;
      }

      console.log('Raw events data:', data);
      
      return data.map(event => ({
        id: event.id,
        title: event.event_name,
        description: event.event_description || '',
        date: new Date(event.start_time),
        endDate: new Date(event.end_time),
        createdAt: new Date(event.created_at || Date.now())
      }));
    },
    enabled: !!familyId
  });

  const addEvent = async (newEvent: any) => {
    try {
      if (!familyId) {
        throw new Error('No family ID available');
      }

      console.log('Adding new event:', newEvent);

      const eventData = {
        family_id: familyId,
        event_name: newEvent.title,
        event_description: newEvent.description || '',
        start_time: newEvent.date.toISOString(),
        end_time: newEvent.endDate?.toISOString() || newEvent.date.toISOString()
      };

      console.log('Event data to insert:', eventData);

      const { data, error } = await supabase
        .from('family_calendar')
        .insert([eventData])
        .select()
        .single();

      if (error) throw error;

      console.log('Successfully added event:', data);

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
      console.log('Deleting event:', id);
      
      const { error } = await supabase
        .from('family_calendar')
        .delete()
        .eq('id', id);

      if (error) throw error;

      console.log('Successfully deleted event:', id);

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

  const todayEvents = events.filter(event => isToday(event.date));

  const upcomingEvents = events
    .filter(event => isFuture(event.date) && !isToday(event.date))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const pastEvents = events
    .filter(event => isPast(event.date) && !isToday(event.date))
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  return {
    events,
    todayEvents,
    upcomingEvents,
    pastEvents,
    addEvent,
    deleteEvent
  };
};