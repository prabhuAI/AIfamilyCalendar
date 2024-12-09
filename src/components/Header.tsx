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
    <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-[32px] p-4 md:p-6 shadow-lg">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-[#4169E1]">
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
            variant="ghost" 
            size="icon"
            onClick={onLogout}
            className="hover:bg-red-50 hover:text-red-600 transition-colors rounded-xl"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};