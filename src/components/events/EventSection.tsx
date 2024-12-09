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
      className="bg-white rounded-xl shadow-sm overflow-hidden"
    >
      <CollapsibleTrigger className="flex justify-between items-center w-full p-3 text-left">
        <h2 className="text-lg font-semibold text-[#1C1C1E]">{title}</h2>
        <ChevronDown className={`h-5 w-5 text-[#8E8E93] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-3 pb-3">
        <EventList
          events={events}
          onDelete={onDelete}
          emptyMessage={emptyMessage}
        />
      </CollapsibleContent>
    </Collapsible>
  );
}