import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { AuthChangeEvent, AuthError, Session } from "@supabase/supabase-js";
import { SignUpForm } from "@/components/SignUpForm";
import { ForgotPassword } from "@/components/ForgotPassword";
import { Button } from "@/components/ui/button";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showSignUp, setShowSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        console.log('Auth state changed:', event, session);
        
        if (event === 'SIGNED_IN' && session) {
          navigate("/");
          toast({
            title: "Welcome!",
            description: "You have successfully signed in.",
          });
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "Account Deleted",
            description: "Your account has been successfully deleted.",
            variant: "destructive",
          });
        }
      }
    );

    // Set up auth error listener
    const handleAuthError = (error: AuthError) => {
      console.error('Auth error:', error);
      let errorMessage = "An error occurred during authentication.";
      
      // Handle specific error cases
      if (error.message.includes("Email not confirmed")) {
        errorMessage = "Please verify your email address before logging in.";
      } else if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (error.message.includes("Email rate limit exceeded")) {
        errorMessage = "Too many attempts. Please try again later.";
      } else if (error.message.includes("Password is too short")) {
        errorMessage = "Password must be at least 6 characters long.";
      }

      toast({
        title: "Authentication Error",
        description: errorMessage,
        variant: "destructive",
      });
    };

    // Subscribe to auth error events using a separate onAuthStateChange
    const { data: { subscription: authErrorSubscription } } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, _session: Session | null, error?: AuthError) => {
        if (error) {
          handleAuthError(error);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
      authErrorSubscription.unsubscribe();
    };
  }, [navigate, toast]);

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-[#F2F2F7] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-2xl font-semibold text-center mb-8 text-[#1C1C1E]">
            Reset Password
          </h1>
          <ForgotPassword onBack={() => setShowForgotPassword(false)} />
        </div>
      </div>
    );
  }

  if (showSignUp) {
    return (
      <div className="min-h-screen bg-[#F2F2F7] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-2xl font-semibold text-center mb-8 text-[#1C1C1E]">
            Create Account
          </h1>
          <SignUpForm onBack={() => setShowSignUp(false)} />
        </div>
      </div>
    );
  }

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
          showLinks={false}
        />
        <div className="space-y-4 mt-4">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setShowSignUp(true)}
          >
            Create Account
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full text-sm text-gray-600"
            onClick={() => setShowForgotPassword(true)}
          >
            Forgot Password?
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;