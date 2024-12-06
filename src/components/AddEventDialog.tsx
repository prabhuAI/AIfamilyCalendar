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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface AddEventDialogProps {
  onAddEvent: (event: any) => void;
  familyId: string;
}

export function AddEventDialog({ onAddEvent, familyId }: AddEventDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string>("");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    
    try {
      let eventDateTime = new Date(date);
      if (time) {
        const [hours, minutes] = time.split(':');
        eventDateTime.setHours(parseInt(hours), parseInt(minutes));
      }

      const { data, error } = await supabase
        .from('family_calendar')
        .insert([
          {
            event_name: title,
            event_description: description,
            start_time: eventDateTime.toISOString(),
            end_time: new Date(eventDateTime.getTime() + 60 * 60 * 1000).toISOString(),
            family_id: familyId
          }
        ])
        .select()
        .single();

      if (error) throw error;

      onAddEvent(data);
      setTitle("");
      setDescription("");
      setDate(null);
      setTime("");
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
        <Button className="bg-[#E8ECF4] hover:bg-[#D8DDE5] text-[#6B7280] shadow-[4px_4px_10px_rgba(163,177,198,0.6),-4px_-4px_10px_rgba(255,255,255,0.8)] rounded-2xl px-6 py-3 font-medium transition-all duration-200 hover:shadow-[2px_2px_5px_rgba(163,177,198,0.6),-2px_-2px_5px_rgba(255,255,255,0.8)]">
          <Plus className="h-5 w-5 mr-2" />
          Add Event
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95%] max-w-[425px] rounded-3xl bg-[#E8ECF4] shadow-[8px_8px_16px_rgba(163,177,198,0.6),-8px_-8px_16px_rgba(255,255,255,0.8)] border-none p-6">
        <DialogHeader>
          <DialogTitle className="text-[#374151] text-xl font-semibold">New Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-[#4B5563]">
              Title *
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 50))}
              required
              maxLength={50}
              className="rounded-xl bg-[#E8ECF4] border-none shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] focus:shadow-[inset_6px_6px_10px_rgba(163,177,198,0.6),inset_-6px_-6px_10px_rgba(255,255,255,0.8)] transition-all duration-200"
            />
            <div className="text-xs text-[#6B7280]">{title.length}/50 characters</div>
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-[#4B5563]">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 100))}
              maxLength={100}
              className="rounded-xl bg-[#E8ECF4] border-none shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] focus:shadow-[inset_6px_6px_10px_rgba(163,177,198,0.6),inset_-6px_-6px_10px_rgba(255,255,255,0.8)] min-h-[100px] transition-all duration-200"
            />
            <div className="text-xs text-[#6B7280]">{description.length}/100 characters</div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#4B5563]">
              Date *
            </label>
            <div className="relative">
              <DatePicker
                selected={date}
                onChange={(date: Date) => setDate(date)}
                dateFormat="MMMM d, yyyy"
                minDate={new Date()}
                placeholderText="Select date"
                className="w-full rounded-xl bg-[#E8ECF4] border-none shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] p-3 focus:shadow-[inset_6px_6px_10px_rgba(163,177,198,0.6),inset_-6px_-6px_10px_rgba(255,255,255,0.8)] transition-all duration-200"
                required
                showPopperArrow={false}
                popperPlacement="bottom-start"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="time" className="text-sm font-medium text-[#4B5563]">
              Time (optional)
            </label>
            <Input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="rounded-xl bg-[#E8ECF4] border-none shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] focus:shadow-[inset_6px_6px_10px_rgba(163,177,198,0.6),inset_-6px_-6px_10px_rgba(255,255,255,0.8)] transition-all duration-200"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[#E8ECF4] hover:bg-[#D8DDE5] text-[#374151] shadow-[4px_4px_10px_rgba(163,177,198,0.6),-4px_-4px_10px_rgba(255,255,255,0.8)] rounded-xl py-3 mt-6 font-medium transition-all duration-200 hover:shadow-[2px_2px_5px_rgba(163,177,198,0.6),-2px_-2px_5px_rgba(255,255,255,0.8)]"
            disabled={!date || !title}
          >
            Add Event
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}