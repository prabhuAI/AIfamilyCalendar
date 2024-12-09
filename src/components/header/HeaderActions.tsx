import { Button } from "@/components/ui/button";
import { Plus, LogOut, User } from "lucide-react";
import { NotificationIcon } from '../NotificationIcon';
import { AddEventDialog } from '../AddEventDialog';
import { useSession } from "@supabase/auth-helpers-react";

interface HeaderActionsProps {
  onLogout: () => void;
  notifications: any[];
  onMarkAsRead: (id: string) => void;
  onAddEvent: (event: any) => void;
}

export function HeaderActions({ onLogout, notifications, onMarkAsRead, onAddEvent }: HeaderActionsProps) {
  const session = useSession();
  const userEmail = session?.user?.email;
  const displayName = userEmail ? userEmail.split('@')[0] : 'User';

  return (
    <div className="flex items-center gap-2 md:gap-4">
      <AddEventDialog onAddEvent={onAddEvent}>
        <Button 
          variant="ghost" 
          size="sm"
          className="flex items-center gap-2 hover:bg-blue-50 text-[#4169E1]"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden md:inline">Add Event</span>
        </Button>
      </AddEventDialog>
      
      <NotificationIcon 
        notifications={notifications} 
        onMarkAsRead={onMarkAsRead}
      />

      <div className="flex items-center gap-2 text-[#4169E1]">
        <User className="h-4 w-4" />
        <span className="hidden md:inline font-medium">{displayName}</span>
      </div>

      <Button 
        variant="ghost" 
        size="sm"
        onClick={onLogout}
        className="flex items-center gap-2 hover:bg-red-50 text-red-600"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden md:inline">Logout</span>
      </Button>
    </div>
  );
}