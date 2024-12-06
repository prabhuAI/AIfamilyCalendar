import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { FamilyEvent } from "@/types/event";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

interface AddEventDialogProps {
  onAddEvent: (event: Omit<FamilyEvent, "id" | "createdAt">) => void;
}

export function AddEventDialog({ onAddEvent }: AddEventDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date>();
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    
    onAddEvent({
      title,
      description,
      date,
    });
    setTitle("");
    setDescription("");
    setDate(undefined);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#007AFF] hover:bg-[#007AFF]/90 text-white rounded-full px-4">
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-2xl bg-[#F2F2F7]/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-[#1C1C1E] text-xl font-semibold">Add New Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-[#3C3C43]">
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="rounded-lg border-[#C7C7CC] focus:border-[#007AFF] focus:ring-[#007AFF]"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-[#3C3C43]">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="rounded-lg border-[#C7C7CC] focus:border-[#007AFF] focus:ring-[#007AFF]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#3C3C43]">
              Date and Time
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) =>
                    date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
          <Button
            type="submit"
            className="w-full bg-[#007AFF] hover:bg-[#007AFF]/90 text-white rounded-full"
            disabled={!date}
          >
            Add Event
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}