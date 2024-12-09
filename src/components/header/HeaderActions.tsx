import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { NotificationIcon } from '../NotificationIcon';
import { AddEventDialog } from '../AddEventDialog';
import { ProfileDropdown } from '../ProfileDropdown';

interface HeaderActionsProps {
  onLogout: () => void;
  notifications: any[];
  onMarkAsRead: (id: string) => void;
  onAddEvent: (event: any) => void;
}

export function HeaderActions({ onLogout, notifications, onMarkAsRead, onAddEvent }: HeaderActionsProps) {
  return (
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
  );
}