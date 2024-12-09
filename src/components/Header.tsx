import React from 'react';
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { NotificationIcon } from './NotificationIcon';
import { AddEventDialog } from './AddEventDialog';
import { ProfileDropdown } from './ProfileDropdown';

interface HeaderProps {
  onLogout: () => void;
  notifications: any[];
  onMarkAsRead: (id: string) => void;
  onAddEvent: (event: any) => void;
}

export const Header = ({ onLogout, notifications, onMarkAsRead, onAddEvent }: HeaderProps) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Family Calendar
        </h1>
        <div className="flex items-center gap-2 md:gap-4">
          <NotificationIcon 
            notifications={notifications} 
            onMarkAsRead={onMarkAsRead}
          />
          <AddEventDialog onAddEvent={onAddEvent} />
          <ProfileDropdown />
          <Button 
            variant="outline" 
            size="icon"
            onClick={onLogout}
            className="hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};