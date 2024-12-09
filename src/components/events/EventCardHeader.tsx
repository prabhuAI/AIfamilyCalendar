import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

interface EventCardHeaderProps {
  title: string;
  onDelete: () => void;
}

export function EventCardHeader({ title, onDelete }: EventCardHeaderProps) {
  return (
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
      <CardTitle className="text-base font-semibold text-gray-900 line-clamp-1">
        {title}
      </CardTitle>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl h-8 w-8"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </CardHeader>
  );
}