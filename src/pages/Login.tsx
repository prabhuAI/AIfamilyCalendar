import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { AuthChangeEvent } from "@supabase/supabase-js";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showSignUp, setShowSignUp] = useState(false);
  const [fullName, setFullName] = useState("");
  const [nickname, setNickname] = useState("");
  const [isFullNameValid, setIsFullNameValid] = useState(false);
  const [isNicknameValid, setIsNicknameValid] = useState(false);

  const validateFullName = (name: string) => {
    return name.length > 0 && name.length <= 16;
  };

  const validateNickname = (nick: string) => {
    return nick.length > 0 && nick.length <= 6;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFullNameValid || !isNicknameValid) {
      toast({
        title: "Validation Error",
        description: "Please check the name and nickname requirements",
        variant: "destructive",
      });
      return;
    }

    const email = (e.target as any).email.value;
    const password = (e.target as any).password.value;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          nickname: nickname,
        },
      },
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Account created successfully! Please check your email to verify your account.",
    });
  };

  useEffect(() => {
    setIsFullNameValid(validateFullName(fullName));
  }, [fullName]);

  useEffect(() => {
    setIsNicknameValid(validateNickname(nickname));
  }, [nickname]);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session) => {
        console.log('Auth state changed:', event, session);
        
        if (event === 'SIGNED_IN' && session) {
          navigate("/");
          toast({
            title: "Welcome!",
            description: "You have successfully signed in.",
          });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  if (showSignUp) {
    return (
      <div className="min-h-screen bg-[#F2F2F7] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-2xl font-semibold text-center mb-8 text-[#1C1C1E]">
            Create Account
          </h1>
          <form onSubmit={handleSignUp} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">
                Full Name (max 16 characters)
                {fullName && (
                  isFullNameValid ? 
                    <Check className="inline-block ml-2 h-4 w-4 text-green-500" /> : 
                    <X className="inline-block ml-2 h-4 w-4 text-red-500" />
                )}
              </Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                maxLength={16}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nickname">
                Nickname (max 6 characters) - Will be displayed in calendar
                {nickname && (
                  isNicknameValid ? 
                    <Check className="inline-block ml-2 h-4 w-4 text-green-500" /> : 
                    <X className="inline-block ml-2 h-4 w-4 text-red-500" />
                )}
              </Label>
              <Input
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setShowSignUp(false)}
            >
              Back to Login
            </Button>
          </form>
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
        <Button
          type="button"
          variant="outline"
          className="w-full mt-4"
          onClick={() => setShowSignUp(true)}
        >
          Create Account
        </Button>
      </div>
    </div>
  );
};

export default Login;