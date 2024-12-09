import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getSpeechRecognition, isIOSDevice, checkMicrophonePermission } from "@/utils/speechRecognition";

interface MicrophoneButtonProps {
  isListening: boolean;
  setIsListening: (value: boolean) => void;
  onTranscript: (text: string) => void;
}

export function MicrophoneButton({ isListening, setIsListening, onTranscript }: MicrophoneButtonProps) {
  const { toast } = useToast();

  const startListening = async () => {
    const SpeechRecognition = getSpeechRecognition();
    console.log("Starting speech recognition...");

    if (!SpeechRecognition) {
      toast({
        title: "Error",
        description: "Speech recognition is not supported in your browser. Please try using Chrome on desktop or Android.",
        variant: "destructive",
      });
      return;
    }

    // Check for iOS device
    if (isIOSDevice()) {
      console.log("iOS device detected");
      const hasPermission = await checkMicrophonePermission();
      if (!hasPermission) {
        toast({
          title: "Microphone Access Required",
          description: "Please enable microphone access in your iOS settings for this website.",
          variant: "destructive",
        });
        return;
      }
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      // Add specific iOS settings
      if (isIOSDevice()) {
        // @ts-ignore - iOS specific property
        recognition.interimResults = true;
        // @ts-ignore - iOS specific property
        recognition.maxAlternatives = 1;
      }

      recognition.onstart = () => {
        console.log("Speech recognition started");
        setIsListening(true);
        toast({
          title: "Listening",
          description: "Speak now...",
        });
      };

      recognition.onresult = (event: any) => {
        console.log("Speech recognition result received", event);
        const transcript = event.results[0][0].transcript;
        console.log("Transcript:", transcript);
        onTranscript(transcript);
        setIsListening(false);
        toast({
          title: "Success",
          description: "Speech captured successfully!",
        });
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        let errorMessage = "Failed to recognize speech. ";
        switch (event.error) {
          case 'network':
            errorMessage += "Please check your internet connection.";
            break;
          case 'not-allowed':
          case 'permission-denied':
            errorMessage += isIOSDevice() 
              ? "Please enable microphone access in your iOS settings."
              : "Microphone permission was denied.";
            break;
          case 'no-speech':
            errorMessage += "No speech was detected. Please try speaking again.";
            break;
          case 'aborted':
            errorMessage += "Speech recognition was aborted. Please try again.";
            break;
          case 'audio-capture':
            errorMessage += "No microphone was found. Please ensure your device has a working microphone.";
            break;
          case 'service-not-allowed':
            errorMessage += "Speech recognition service is not allowed. Please try again.";
            break;
          default:
            errorMessage += "Please try again.";
        }

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      };

      recognition.onend = () => {
        console.log("Speech recognition ended");
        setIsListening(false);
      };

      recognition.start();
    } catch (error) {
      console.error('Speech recognition initialization error:', error);
      setIsListening(false);
      toast({
        title: "Error",
        description: "Failed to initialize speech recognition. Please try a different browser.",
        variant: "destructive",
      });
    }
  };

  return (
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
  );
}