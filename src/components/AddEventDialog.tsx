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
  const [open, setOpen] = useState(false);
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
      setDate(null);
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
        <Button className="bg-[#007AFF] hover:bg-[#007AFF]/90 text-white rounded-full px-4 w-full md:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95%] max-w-[425px] rounded-2xl bg-[#F2F2F7]/95 backdrop-blur-sm p-4 md:p-6">
        <DialogHeader>
          <DialogTitle className="text-[#1C1C1E] text-xl font-semibold">Add New Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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
              className="rounded-lg border-[#C7C7CC] focus:border-[#007AFF] focus:ring-[#007AFF] min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#3C3C43]">
              Date and Time
            </label>
            <div className="relative">
              <DatePicker
                selected={date}
                onChange={(date: Date) => setDate(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                minDate={new Date()}
                placeholderText="Select date and time"
                className="w-full rounded-lg border border-[#C7C7CC] p-2 focus:border-[#007AFF] focus:ring-[#007AFF]"
                required
                showPopperArrow={false}
                popperClassName="react-datepicker-popper"
                popperPlacement="bottom-start"
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-[#007AFF] hover:bg-[#007AFF]/90 text-white rounded-full py-2 mt-4"
            disabled={!date}
          >
            Add Event
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}