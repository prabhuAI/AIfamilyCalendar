import { useState } from "react";
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
import { Wand2, Mic, MicOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AIEventsDialogProps {
  onAddEvent: (event: any) => void;
}

export function AIEventsDialog({ onAddEvent }: AIEventsDialogProps) {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast({
        title: "Error",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setPrompt(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      toast({
        title: "Error",
        description: "Failed to recognize speech. Please try again.",
        variant: "destructive",
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleGenerateEvents = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Starting event generation with prompt:', prompt);
      const response = await supabase.functions.invoke('generate-events', {
        body: { prompt },
      });

      console.log('Edge function response:', response);

      if (response.error) {
        console.error('Edge function error:', response.error);
        throw new Error(response.error.message);
      }

      const { events } = response.data;

      if (!events || !Array.isArray(events)) {
        console.error('Invalid events data:', response.data);
        throw new Error('Invalid response format from AI');
      }

      console.log('Generated events:', events);

      if (events.length > 0) {
        for (const event of events) {
          await onAddEvent({
            title: event.title,
            description: event.description,
            date: new Date(event.date),
            endDate: new Date(new Date(event.date).getTime() + 60 * 60 * 1000),
          });
        }

        toast({
          title: "Events generated",
          description: `Successfully added ${events.length} events to your calendar.`,
        });
        setOpen(false);
      } else {
        throw new Error('No events were generated');
      }
    } catch (error: any) {
      console.error("Error generating events:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate events. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline"
          className="w-full mt-4 bg-[#E8ECF4] hover:bg-[#D8DDE5] text-[#6B7280] shadow-[4px_4px_10px_rgba(163,177,198,0.6),-4px_-4px_10px_rgba(255,255,255,0.8)] rounded-2xl px-6 py-3 font-medium transition-all duration-200 hover:shadow-[2px_2px_5px_rgba(163,177,198,0.6),-2px_-2px_5px_rgba(255,255,255,0.8)]"
        >
          <Wand2 className="h-5 w-5 mr-2" />
          Generate with AI
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95%] max-w-[425px] rounded-3xl bg-[#E8ECF4] shadow-[8px_8px_16px_rgba(163,177,198,0.6),-8px_-8px_16px_rgba(255,255,255,0.8)] border-none p-6">
        <DialogHeader>
          <DialogTitle className="text-[#374151] text-xl font-semibold">Generate Events with AI</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleGenerateEvents} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="prompt" className="text-sm font-medium text-[#4B5563]">
              What events would you like to create?
            </Label>
            <div className="flex gap-2">
              <Input
                id="prompt"
                placeholder="E.g., Generate events for a week-long family vacation"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
                className="flex-1 rounded-xl bg-[#E8ECF4] border-none shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] focus:shadow-[inset_6px_6px_10px_rgba(163,177,198,0.6),inset_-6px_-6px_10px_rgba(255,255,255,0.8)] transition-all duration-200"
              />
              <Button
                type="button"
                onClick={startListening}
                disabled={isListening}
                className="bg-[#E8ECF4] hover:bg-[#D8DDE5] text-[#374151] shadow-[4px_4px_10px_rgba(163,177,198,0.6),-4px_-4px_10px_rgba(255,255,255,0.8)] rounded-xl transition-all duration-200 hover:shadow-[2px_2px_5px_rgba(163,177,198,0.6),-2px_-2px_5px_rgba(255,255,255,0.8)]"
              >
                {isListening ? (
                  <MicOff className="h-5 w-5" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#E8ECF4] hover:bg-[#D8DDE5] text-[#374151] shadow-[4px_4px_10px_rgba(163,177,198,0.6),-4px_-4px_10px_rgba(255,255,255,0.8)] rounded-xl py-3 mt-6 font-medium transition-all duration-200 hover:shadow-[2px_2px_5px_rgba(163,177,198,0.6),-2px_-2px_5px_rgba(255,255,255,0.8)]"
          >
            {isLoading ? "Generating..." : "Generate Events"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}