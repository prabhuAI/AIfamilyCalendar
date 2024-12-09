import { Card } from "@/components/ui/card";
import { FamilyEvent } from "@/types/event";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";

interface EventCardProps {
  event: FamilyEvent;
  onDelete: (id: string) => void;
}

export function EventCard({ event, onDelete }: EventCardProps) {
  const formatEventDate = (date: Date) => {
    return format(date, "HH:mm");
  };

  const formatEventDay = (date: Date) => {
    return format(date, "d MMM").toLowerCase();
  };

  return (
    <Card className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border border-white/20 hover:bg-white/90 transition-all duration-200">
      <div className="flex items-center space-x-4">
        <div className="text-left">
          <div className="text-sm text-gray-500 font-medium">
            {formatEventDay(event.date)}
          </div>
          <div className="text-base font-semibold text-gray-900">
            {formatEventDate(event.date)}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-medium text-gray-900 truncate">
            {event.title}
          </h3>
          {event.description && (
            <p className="text-sm text-gray-500 truncate">{event.description}</p>
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(event.id)}
        className="text-gray-400 hover:text-red-500 hover:bg-red-50 ml-2"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </Card>
  );
}