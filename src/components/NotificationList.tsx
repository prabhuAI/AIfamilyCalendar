import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Check } from "lucide-react";

interface Notification {
  id: string;
  event_name: string;
  event_description?: string;
  start_time: string;
  read: boolean;
}

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
}

export const NotificationList = ({ notifications, onMarkAsRead }: NotificationListProps) => {
  return (
    <ScrollArea className="h-[300px] w-[350px] rounded-md border bg-white p-4">
      {notifications.length === 0 ? (
        <div className="text-center text-gray-500 py-4">No notifications</div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start justify-between p-3 rounded-lg ${
                notification.read ? 'bg-gray-50' : 'bg-blue-50'
              }`}
            >
              <div className="space-y-1">
                <p className="font-medium text-sm">{notification.event_name}</p>
                {notification.event_description && (
                  <p className="text-sm text-gray-500">{notification.event_description}</p>
                )}
                <p className="text-xs text-gray-400">
                  {format(new Date(notification.start_time), 'PPp')}
                </p>
              </div>
              {!notification.read && (
                <button
                  onClick={() => onMarkAsRead(notification.id)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  <Check className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </ScrollArea>
  );
};