import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Header } from "@/components/Header";
import { EventSections } from "@/components/events/EventSections";
import { useEvents } from "@/hooks/useEvents";
import { useNotifications } from "@/hooks/useNotifications";

const Index = () => {
  const [isUpcomingOpen, setIsUpcomingOpen] = useState(false);
  const [isPastOpen, setIsPastOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { todayEvents, upcomingEvents, pastEvents, addEvent, deleteEvent } = useEvents();
  const { notifications, markAsRead } = useNotifications();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log("Session check result:", session ? "Session exists" : "No session", error);
        
        if (error) {
          console.error("Session check error:", error);
          await handleAuthError(error);
          return;
        }
        
        if (!session) {
          console.log("No active session found");
          navigate('/login');
          return;
        }

        const { data: user, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          console.error("User verification error:", userError);
          await handleAuthError(userError);
          return;
        }
      } catch (error) {
        console.error("Unexpected error during session check:", error);
        await handleAuthError(error);
      }
    };

    checkSession();
  }, [navigate, toast]);

  const handleAuthError = async (error: any) => {
    console.log("Handling auth error:", error);
    
    localStorage.clear();
    sessionStorage.clear();
    
    try {
      await supabase.auth.signOut();
    } catch (signOutError) {
      console.error("Error during sign out:", signOutError);
    }

    toast({
      title: "Authentication Error",
      description: "Please sign in again.",
      variant: "destructive",
    });

    navigate('/login');
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
        if (error.message?.includes('user_not_found')) {
          localStorage.clear();
          sessionStorage.clear();
          navigate('/login');
          return;
        }
        
        toast({
          title: "Error",
          description: "Failed to log out. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      localStorage.clear();
      sessionStorage.clear();
      navigate('/login');
    } catch (error: any) {
      console.error("Unexpected error during logout:", error);
      localStorage.clear();
      sessionStorage.clear();
      navigate('/login');
      
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMarkAsRead = (id: string) => {
    markAsRead.mutate(id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8ECF4] to-[#F8F9FB] py-4 md:py-6">
      <div className="container mx-auto px-4 max-w-3xl space-y-4 md:space-y-6">
        <Header 
          onLogout={handleLogout}
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onAddEvent={addEvent}
        />
        <div className="space-y-4">
          <EventSections
            todayEvents={todayEvents}
            upcomingEvents={upcomingEvents}
            pastEvents={pastEvents}
            isUpcomingOpen={isUpcomingOpen}
            isPastOpen={isPastOpen}
            setIsUpcomingOpen={setIsUpcomingOpen}
            setIsPastOpen={setIsPastOpen}
            onDelete={deleteEvent}
            onAddEvent={addEvent}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;