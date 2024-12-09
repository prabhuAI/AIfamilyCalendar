import React from 'react';
import { Button } from "@/components/ui/button";
import { LogOut, UserRound } from "lucide-react";
import { NotificationIcon } from './NotificationIcon';
import { AddEventDialog } from './AddEventDialog';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

interface HeaderProps {
  onLogout: () => void;
  notifications: any[];
  onMarkAsRead: (id: string) => void;
  onAddEvent: (event: any) => void;
}

export const Header = ({ onLogout, notifications, onMarkAsRead, onAddEvent }: HeaderProps) => {
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data } = await supabase
        .from('profiles')
        .select('nickname')
        .eq('id', user.id)
        .single();
      
      return data;
    }
  });

  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-semibold text-[#1C1C1E] tracking-tight">Family Calendar</h1>
        {profile && (
          <div className="flex items-center gap-2 ml-4 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            <UserRound className="h-4 w-4" />
            <span>{profile.nickname}</span>
          </div>
        )}
      </div>
      <div className="flex gap-4 items-center">
        <NotificationIcon 
          notifications={notifications} 
          onMarkAsRead={onMarkAsRead}
        />
        <AddEventDialog onAddEvent={onAddEvent} />
        <Button 
          variant="outline" 
          size="icon"
          onClick={onLogout}
          className="hover:bg-red-100"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};