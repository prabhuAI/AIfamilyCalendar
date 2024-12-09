import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AIEventsForm } from "./AIEventsForm";
import { useIsMobile } from "@/hooks/use-mobile";

interface AIEventsDialogProps {
  onAddEvent: (event: any) => void;
}

export function AIEventsDialog({ onAddEvent }: AIEventsDialogProps) {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

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
          className="w-full bg-white/80 backdrop-blur-sm hover:bg-white/90 text-[#4169E1] shadow-lg rounded-[24px] px-6 py-3 font-medium transition-all duration-200 border border-white/20"
        >
          <Wand2 className="h-5 w-5 mr-2" />
          Add Events with AI
        </Button>
      </DialogTrigger>
      <DialogContent 
        className={`
          w-[95%] max-w-[425px] rounded-[24px] bg-white/90 backdrop-blur-sm
          shadow-lg border border-white/20 p-6 
          ${isMobile ? 
            'fixed bottom-0 left-[50%] translate-x-[-50%] translate-y-0 rounded-b-none' : 
            'fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'
          }
          max-h-[80vh] overflow-y-auto
          transition-all duration-300
        `}
      >
        <DialogHeader>
          <DialogTitle className="text-[#4169E1] text-xl font-semibold">Generate Events with AI</DialogTitle>
        </DialogHeader>
        <AIEventsForm
          prompt={prompt}
          setPrompt={setPrompt}
          isListening={isListening}
          setIsListening={setIsListening}
          isLoading={isLoading}
          onSubmit={handleGenerateEvents}
        />
      </DialogContent>
    </Dialog>
  );
}
