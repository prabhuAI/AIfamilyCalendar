import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { EventSections } from "@/components/EventSections";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { format } from "date-fns";

const Index = () => {
  const [isUpcomingOpen, setIsUpcomingOpen] = useState(false);
  const [isPastOpen, setIsPastOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [familyId, setFamilyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  useEffect(() => {
    const checkUpcomingEvents = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('check-upcoming-events');
        if (error) throw error;

        if (data.upcomingEvents && data.upcomingEvents.length > 0) {
          const newNotifications = data.upcomingEvents.map((event: any) => ({
            id: event.id,
            event_name: event.event_name,
            event_description: event.event_description,
            start_time: event.start_time,
            read: false
          }));

          setNotifications(prev => {
            const existingIds = new Set(prev.map(n => n.id));
            const uniqueNewNotifications = newNotifications.filter(n => !existingIds.has(n.id));
            return [...prev, ...uniqueNewNotifications];
          });

          data.upcomingEvents.forEach((event: any) => {
            if (Notification.permission === "granted") {
              new Notification(`Upcoming Event: ${event.event_name}`, {
                body: `Starting in less than an hour: ${event.event_description || ''}`,
                icon: '/favicon.ico'
              });
            }
          });
        }
      } catch (error) {
        console.error('Error checking upcoming events:', error);
      }
    };

    const notificationInterval = setInterval(checkUpcomingEvents, 60000);
    checkUpcomingEvents();

    return () => clearInterval(notificationInterval);
  }, []);

  useEffect(() => {
    const fetchOrCreateFamily = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: familyMember } = await supabase
          .from('family_members')
          .select('family_id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (familyMember) {
          setFamilyId(familyMember.family_id);
        } else {
          const { data: newFamily, error: familyError } = await supabase
            .from('families')
            .insert([{ family_name: 'My Family' }])
            .select()
            .single();

          if (familyError) throw familyError;

          if (newFamily) {
            const { error: membershipError } = await supabase
              .from('family_members')
              .insert([{ 
                family_id: newFamily.id, 
                user_id: user.id 
              }]);

            if (membershipError) throw membershipError;
            setFamilyId(newFamily.id);
          }
        }
      } catch (error: any) {
        console.error('Error in fetchOrCreateFamily:', error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrCreateFamily();
  }, [toast]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F2F2F7] flex items-center justify-center">
        <div className="text-[#1C1C1E]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F7]">
      <div className="container max-w-2xl py-8 px-4 md:px-8">
        <Header 
          familyId={familyId}
          onLogout={handleLogout}
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onAddEvent={addEvent}
        />
        <EventSections
          todayEvents={todayEvents}
          upcomingEvents={upcomingEvents}
          pastEvents={pastEvents}
          isUpcomingOpen={isUpcomingOpen}
          isPastOpen={isPastOpen}
          setIsUpcomingOpen={setIsUpcomingOpen}
          setIsPastOpen={setIsPastOpen}
          onDelete={deleteEvent}
        />
      </div>
    </div>
  );
};

export default Index;