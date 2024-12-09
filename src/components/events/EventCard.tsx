import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FamilyEvent } from "@/types/event";
import { Trash2 } from "lucide-react";
import { EventDateTime } from "./EventDateTime";

interface EventCardProps {
  event: FamilyEvent;
  onDelete: (id: string) => void;
}

export function EventCard({ event, onDelete }: EventCardProps) {
  return (
    <Card className="animate-fade-in bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
        <CardTitle className="text-base font-semibold text-gray-900 line-clamp-1">
          {event.title}
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(event.id)}
          className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl h-8 w-8"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <EventDateTime date={event.date} />
        <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
      </CardContent>
    </Card>
  );
}