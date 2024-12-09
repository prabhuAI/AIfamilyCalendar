import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { FamilyEvent } from "@/types/event";
import { EventList } from "./EventList";

interface EventSectionProps {
  title: string;
  events: FamilyEvent[];
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  onDelete: (id: string) => void;
  emptyMessage?: string;
}

export function EventSection({
  title,
  events,
  isOpen,
  onOpenChange,
  onDelete,
  emptyMessage
}: EventSectionProps) {
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onOpenChange}
      className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 overflow-hidden"
    >
      <CollapsibleTrigger className="flex justify-between items-center w-full p-4 text-left hover:bg-gray-50/50 transition-colors">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <ChevronDown 
          className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-4">
        <EventList
          events={events}
          onDelete={onDelete}
          emptyMessage={emptyMessage}
        />
      </CollapsibleContent>
    </Collapsible>
  );
}