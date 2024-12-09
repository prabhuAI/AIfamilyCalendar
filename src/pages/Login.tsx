import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { AuthChangeEvent } from "@supabase/supabase-js";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
          .from('notification_preferences')
          .upsert({ 
            user_id: user.id,
            browser_notifications: true 
          });
        
        if (error) throw error;
        
        toast({
          title: "Notifications enabled",
          description: "You will receive notifications for upcoming events.",
        });
      }
    } catch (error: any) {
      console.error('Error setting up notifications:', error);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session) => {
        if (event === 'SIGNED_IN') {
          await requestNotificationPermission();
          navigate("/");
          toast({
            title: "Welcome!",
            description: "You have successfully signed in.",
          });
        }
        if (event === 'SIGNED_OUT') {
          toast({
            title: "Signed out",
            description: "You have been signed out successfully.",
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-[#F2F2F7] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8">
        <h1 className="text-2xl font-semibold text-center mb-8 text-[#1C1C1E]">
          Family Calendar
        </h1>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#007AFF',
                  brandAccent: '#0056b3',
                }
              }
            },
            className: {
              container: 'auth-container',
              button: 'auth-button',
              input: 'auth-input',
            },
          }}
          providers={[]}
          redirectTo={`${window.location.origin}/`}
          onlyThirdPartyProviders={false}
          view="sign_in"
          showLinks={true}
        />
      </div>
    </div>
  );
};

export default Login;