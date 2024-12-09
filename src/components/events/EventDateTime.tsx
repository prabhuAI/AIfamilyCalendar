import { format } from "date-fns";
import { Clock } from "lucide-react";

interface EventDateTimeProps {
  date: Date;
}

export function EventDateTime({ date }: EventDateTimeProps) {
  const formatDate = (date: Date) => {
    const today = new Date();
    
    // Remove any timestamp info for date comparison
    const todayStr = format(today, 'yyyy-MM-dd');
    const eventStr = format(date, 'yyyy-MM-dd');
    
    if (todayStr === eventStr) {
      return `Today at ${format(date, 'h:mm a')}`;
    }
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (format(tomorrow, 'yyyy-MM-dd') === eventStr) {
      return `Tomorrow at ${format(date, 'h:mm a')}`;
    }
    
    if (today.getFullYear() === date.getFullYear()) {
      return format(date, 'MMM d at h:mm a');
    }
    
    return format(date, 'MMM d, yyyy at h:mm a');
  };

  return (
    <div className="flex items-center text-sm text-[#6B7280] mb-2">
      <Clock className="h-4 w-4 mr-1.5 text-[#9CA3AF]" />
      {formatDate(date)}
    </div>
  );
}