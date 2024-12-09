import { HeaderTitle } from './header/HeaderTitle';
import { HeaderActions } from './header/HeaderActions';

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
        <HeaderTitle />
        <HeaderActions 
          onLogout={onLogout}
          notifications={notifications}
          onMarkAsRead={onMarkAsRead}
          onAddEvent={onAddEvent}
        />
      </div>
    </div>
  );
};