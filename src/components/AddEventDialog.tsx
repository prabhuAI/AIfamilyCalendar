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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface AddEventDialogProps {
  onAddEvent: (event: any) => void;
  familyId: string;
}

export function AddEventDialog({ onAddEvent, familyId }: AddEventDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date>();
  const [open, setOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    
    try {
      const { data, error } = await supabase
        .from('family_calendar')
        .insert([
          {
            event_name: title,
            event_description: description,
            start_time: date.toISOString(),
            end_time: new Date(date.getTime() + 60 * 60 * 1000).toISOString(), // 1 hour duration
            family_id: familyId
          }
        ])
        .select()
        .single();

      if (error) throw error;

      onAddEvent(data);
      setTitle("");
      setDescription("");
      setDate(undefined);
      setOpen(false);

      toast({
        title: "Success",
        description: "Event added successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
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
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
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
                  onSelect={(newDate) => {
                    if (newDate) {
                      setDate(newDate);
                      setCalendarOpen(false);
                    }
                  }}
                  disabled={(date) =>
                    date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                  initialFocus
                  fromDate={new Date()}
                  className="rounded-md border shadow p-3"
                  modifiersStyles={{
                    selected: {
                      backgroundColor: '#007AFF',
                      color: 'white',
                      borderRadius: '0.375rem',
                    },
                    today: {
                      backgroundColor: '#E5E5EA',
                      borderRadius: '0.375rem',
                    }
                  }}
                  styles={{
                    day: { margin: '0.15rem' },
                    caption: { paddingBottom: '0.5rem' },
                    head_cell: { padding: '0.5rem 0' },
                    table: { width: '100%', borderSpacing: '0.25rem' },
                    cell: { padding: '0.25rem' },
                    nav_button: { margin: '0 0.5rem' }
                  }}
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