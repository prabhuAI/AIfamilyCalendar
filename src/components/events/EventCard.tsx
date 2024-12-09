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
    <Card className="animate-fade-in bg-[#E8ECF4] border-none rounded-2xl shadow-[4px_4px_10px_rgba(163,177,198,0.6),-4px_-4px_10px_rgba(255,255,255,0.8)] hover:shadow-[6px_6px_12px_rgba(163,177,198,0.6),-6px_-6px_12px_rgba(255,255,255,0.8)] transition-all duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
        <CardTitle className="text-base font-semibold text-[#374151] line-clamp-1">{event.title}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(event.id)}
          className="text-[#EF4444] hover:text-[#DC2626] hover:bg-[#FEE2E2] rounded-xl h-8 w-8"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <EventDateTime date={event.date} />
        <p className="text-sm text-[#4B5563] line-clamp-2">{event.description}</p>
      </CardContent>
    </Card>
  );
}