import { CardContent } from "@/components/ui/card";
import { EventDateTime } from "./EventDateTime";

interface EventCardContentProps {
  date: Date;
  description: string;
}

export function EventCardContent({ date, description }: EventCardContentProps) {
  return (
    <CardContent className="px-4 pb-4">
      <EventDateTime date={date} />
      <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
    </CardContent>
  );
}