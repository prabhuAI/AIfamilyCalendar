import { useState, useEffect } from "react";
import { AddEventDialog } from "@/components/AddEventDialog";
import { EventCard } from "@/components/EventCard";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const Index = () => {
  const [isUpcomingOpen, setIsUpcomingOpen] = useState(false);
  const [isPastOpen, setIsPastOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [familyId, setFamilyId] = useState<string | null>(null);

  // Fetch family ID for the current user
  useEffect(() => {
    const fetchFamilyId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: familyMember } = await supabase
          .from('family_members')
          .select('family_id')
          .eq('user_id', user.id)
          .single();
        
        if (familyMember) {
          setFamilyId(familyMember.family_id);
        } else {
          // Create a new family if user doesn't have one
          const { data: newFamily } = await supabase
            .from('families')
            .insert([{ family_name: 'My Family' }])
            .select()
            .single();

          if (newFamily) {
            await supabase
              .from('family_members')
              .insert([{ family_id: newFamily.id, user_id: user.id }]);
            setFamilyId(newFamily.id);
          }
        }
      }
    };

    fetchFamilyId();
  }, []);

  // Fetch events query
  const { data: events = [] } = useQuery({
    queryKey: ['events', familyId],
    queryFn: async () => {
      if (!familyId) return [];
      const { data, error } = await supabase
        .from('family_calendar')
        .select('*')
        .eq('family_id', familyId);
      
      if (error) throw error;
      return data.map(event => ({
        id: event.id,
        title: event.event_name,
        description: event.event_description,
        date: new Date(event.start_time),
        createdAt: new Date(event.created_at)
      }));
    },
    enabled: !!familyId
  });

  const addEvent = async (newEvent: any) => {
    queryClient.invalidateQueries({ queryKey: ['events'] });
    toast({
      title: "Event added",
      description: "Your event has been successfully added to the calendar.",
    });
  };

  const deleteEvent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('family_calendar')
        .delete()
        .eq('id', id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: "Event deleted",
        description: "Your event has been successfully removed from the calendar.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
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

  if (!familyId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F2F2F7]">
      <div className="container max-w-2xl py-8 px-4 md:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-[#1C1C1E] tracking-tight">Family Calendar</h1>
          <AddEventDialog onAddEvent={addEvent} familyId={familyId} />
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