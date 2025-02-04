import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { SessionContextProvider, useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Groceries from "./pages/Groceries";
import Todos from "./pages/Todos";
import PaymentReminders from "./pages/PaymentReminders";
import { useEffect, useState } from "react";
import { useToast } from "./components/ui/use-toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      throwOnError: false,
      retryDelay: 1000,
    },
  },
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          throw error;
        }

        if (!currentSession) {
          console.log("No active session found in ProtectedRoute");
          // Clear any stale auth data
          await supabase.auth.signOut();
          navigate('/login');
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        // Clear any stale auth data
        await supabase.auth.signOut();
        toast({
          title: "Session Expired",
          description: "Please sign in again",
          variant: "destructive",
        });
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        if (!session) {
          navigate("/login");
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  if (isLoading) {
    return null;
  }

  if (!session) {
    return <Navigate to="/login" />;
  }

  return children;
};

const App = () => {
  const [initialized, setInitialized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session initialization error:", error);
          throw error;
        }
        
        console.log("Initial session state:", session ? "Session exists" : "No session");
        
        if (session) {
          try {
            const { error: refreshError } = await supabase.auth.refreshSession();
            if (refreshError) {
              console.error("Session refresh error:", refreshError);
              if (refreshError.message.includes('refresh_token_not_found')) {
                await supabase.auth.signOut();
                throw new Error('Session expired. Please sign in again.');
              }
              throw refreshError;
            }
          } catch (refreshError) {
            console.error("Error refreshing session:", refreshError);
            await supabase.auth.signOut();
            throw refreshError;
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        // Ensure we clear any stale auth state
        await supabase.auth.signOut();
        toast({
          title: "Authentication Error",
          description: "Please sign in again",
          variant: "destructive",
        });
      } finally {
        setInitialized(true);
      }
    };

    initializeAuth();
  }, [toast]);

  if (!initialized) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/groceries"
                element={
                  <ProtectedRoute>
                    <Groceries />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/todos"
                element={
                  <ProtectedRoute>
                    <Todos />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment-reminders"
                element={
                  <ProtectedRoute>
                    <PaymentReminders />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
};

export default App;