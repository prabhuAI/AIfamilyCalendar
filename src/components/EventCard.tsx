import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FamilyEvent } from "@/types/event";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";

interface EventCardProps {
  event: FamilyEvent;
  onDelete: (id: string) => void;
}

export function EventCard({ event, onDelete }: EventCardProps) {
  return (
    <Card className="animate-fade-in bg-[#FFFFFF] border-0 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
        <CardTitle className="text-base font-semibold text-[#1C1C1E]">{event.title}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(event.id)}
          className="text-[#FF3B30] hover:text-[#FF3B30]/90 hover:bg-[#FF3B30]/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <p className="text-sm text-[#8E8E93] mb-2">
          {format(new Date(event.date), "PPP 'at' p")}
        </p>
        <p className="text-sm text-[#3C3C43]">{event.description}</p>
      </CardContent>
    </Card>
  );
}