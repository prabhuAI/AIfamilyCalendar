import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { MicrophoneButton } from "../MicrophoneButton";
import { useEffect, useRef } from "react";

interface AIEventsFormProps {
  prompt: string;
  setPrompt: (value: string) => void;
  isListening: boolean;
  setIsListening: (value: boolean) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function AIEventsForm({
  prompt,
  setPrompt,
  isListening,
  setIsListening,
  isLoading,
  onSubmit
}: AIEventsFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClearPrompt = () => {
    setPrompt("");
    inputRef.current?.focus();
  };

  // Handle input focus
  const handleInputFocus = () => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 300); // Wait for keyboard to appear
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5 mt-4">
      <div className="space-y-2">
        <Label htmlFor="prompt" className="text-sm font-medium text-[#4B5563]">
          What events would you like to create?
        </Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              id="prompt"
              placeholder="E.g., Generate events for a week-long family vacation"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onFocus={handleInputFocus}
              required
              className="flex-1 rounded-xl bg-[#E8ECF4] border-none shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] focus:shadow-[inset_6px_6px_10px_rgba(163,177,198,0.6),inset_-6px_-6px_10px_rgba(255,255,255,0.8)] transition-all duration-200 pr-8"
            />
            {prompt && (
              <button
                type="button"
                onClick={handleClearPrompt}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[#D8DDE5] text-[#6B7280] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <MicrophoneButton
            isListening={isListening}
            setIsListening={setIsListening}
            onTranscript={setPrompt}
          />
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
  );
}