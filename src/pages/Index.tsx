import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Header } from "@/components/Header";
import { EventSections } from "@/components/EventSections";
import { useEvents } from "@/hooks/useEvents";
import { useNotifications } from "@/hooks/useNotifications";

const Index = () => {
  const [isUpcomingOpen, setIsUpcomingOpen] = useState(false);
  const [isPastOpen, setIsPastOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { todayEvents, upcomingEvents, pastEvents, addEvent, deleteEvent } = useEvents();
  const { notifications, markAsRead } = useNotifications();

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
    markAsRead.mutate(id);
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7]">
      <div className="container max-w-2xl py-8 px-4 md:px-8">
        <Header 
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