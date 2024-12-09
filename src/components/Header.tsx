import React from 'react';
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { NotificationIcon } from './NotificationIcon';
import { AddEventDialog } from './AddEventDialog';

interface HeaderProps {
  onLogout: () => void;
  notifications: any[];
  onMarkAsRead: (id: string) => void;
  onAddEvent: (event: any) => void;
}

export const Header = ({ onLogout, notifications, onMarkAsRead, onAddEvent }: HeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-semibold text-[#1C1C1E] tracking-tight">Family Calendar</h1>
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