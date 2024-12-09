import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Plus } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AddEventDialogProps {
  onAddEvent: (event: any) => void;
}

export function AddEventDialog({ onAddEvent }: AddEventDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string>("");
  const [selectedMember, setSelectedMember] = useState<string>("");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const { data: familyMembers } = useQuery({
    queryKey: ['familyMembers'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: familyMember } = await supabase
        .from('family_members')
        .select('family_id')
        .eq('user_id', user.id)
        .single();

      if (!familyMember) return [];

      const { data: members } = await supabase
        .from('family_members')
        .select('profiles(full_name, nickname)')
        .eq('family_id', familyMember.family_id);

      return members || [];
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    
    try {
      let eventDateTime = new Date(date);
      if (time) {
        const [hours, minutes] = time.split(':');
        eventDateTime.setHours(parseInt(hours), parseInt(minutes));
      }

      await onAddEvent({
        title,
        description,
        date: eventDateTime,
        endDate: new Date(eventDateTime.getTime() + 60 * 60 * 1000), // 1 hour duration
        assignedTo: selectedMember
      });

      setTitle("");
      setDescription("");
      setDate(null);
      setTime("");
      setSelectedMember("");
      setOpen(false);
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
            <Label htmlFor="title" className="text-sm font-medium text-[#4B5563]">
              Title *
            </Label>
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
            <Label htmlFor="description" className="text-sm font-medium text-[#4B5563]">
              Description
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 50))}
              maxLength={50}
              className="rounded-xl bg-[#E8ECF4] border-none shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] focus:shadow-[inset_6px_6px_10px_rgba(163,177,198,0.6),inset_-6px_-6px_10px_rgba(255,255,255,0.8)] transition-all duration-200"
            />
            <div className="text-xs text-[#6B7280]">{description.length}/50 characters</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#4B5563]">
                Date *
              </Label>
              <div className="relative">
                <DatePicker
                  selected={date}
                  onChange={(date: Date) => setDate(date)}
                  dateFormat="MMMM d, yyyy"
                  minDate={new Date()}
                  placeholderText="Select date"
                  className="w-full rounded-xl bg-[#E8ECF4] border-none shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] p-3 focus:shadow-[inset_6px_6px_10px_rgba(163,177,198,0.6),inset_-6px_-6px_10px_rgba(255,255,255,0.8)] transition-all duration-200"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm font-medium text-[#4B5563]">
                Time
              </Label>
              <Input
                type="time"
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="rounded-xl bg-[#E8ECF4] border-none shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] focus:shadow-[inset_6px_6px_10px_rgba(163,177,198,0.6),inset_-6px_-6px_10px_rgba(255,255,255,0.8)] transition-all duration-200"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="member" className="text-sm font-medium text-[#4B5563]">
              Assign to (optional)
            </Label>
            <Select value={selectedMember} onValueChange={setSelectedMember}>
              <SelectTrigger className="rounded-xl bg-[#E8ECF4] border-none shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.8)]">
                <SelectValue placeholder="Select a family member" />
              </SelectTrigger>
              <SelectContent>
                {familyMembers?.map((member: any, index: number) => (
                  <SelectItem key={index} value={member.profiles.nickname}>
                    {member.profiles.full_name} ({member.profiles.nickname})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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