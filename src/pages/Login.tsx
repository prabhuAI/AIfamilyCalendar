import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN') {
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
        if (event === 'PASSWORD_RECOVERY') {
          toast({
            title: "Password Recovery",
            description: "Check your email for the password reset link.",
          });
        }
        if (event === 'USER_UPDATED') {
          toast({
            title: "Profile Updated",
            description: "Your profile has been updated successfully.",
          });
        }
        if (event === 'USER_DELETED') {
          toast({
            title: "Account Deleted",
            description: "Your account has been deleted successfully.",
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
          providers={["google"]}
          redirectTo={`${window.location.origin}/`}
          onlyThirdPartyProviders={false}
          view="sign_in"
          showLinks={true}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email',
                password_label: 'Password',
                button_label: 'Sign In',
                loading_button_label: 'Signing in...',
                social_provider_text: 'Sign in with {{provider}}',
                link_text: "Already have an account? Sign in",
              },
              sign_up: {
                email_label: 'Email',
                password_label: 'Password',
                button_label: 'Sign Up',
                loading_button_label: 'Signing up...',
                social_provider_text: 'Sign up with {{provider}}',
                link_text: "Don't have an account? Sign up",
              },
              forgotten_password: {
                email_label: 'Email',
                button_label: 'Send Reset Instructions',
                loading_button_label: 'Sending reset instructions...',
                link_text: 'Forgot your password?',
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Login;