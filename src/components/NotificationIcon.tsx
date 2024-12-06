import React from 'react';
import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NotificationList } from './NotificationList';
import { Badge } from "@/components/ui/badge";

interface Notification {
  id: string;
  event_name: string;
  event_description?: string;
  start_time: string;
  read: boolean;
}

interface NotificationIconProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
}

export const NotificationIcon = ({ notifications, onMarkAsRead }: NotificationIconProps) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-blue-500 text-white p-0 text-xs"
              variant="default"
            >
              {unreadCount}
            </Badge>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="end">
        <NotificationList 
          notifications={notifications} 
          onMarkAsRead={onMarkAsRead}
        />
      </PopoverContent>
    </Popover>
  );
};