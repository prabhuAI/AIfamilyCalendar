export const getSpeechRecognition = () => {
  // Try to get the iOS-specific SpeechRecognition first
  const iOSRecognition = (window as any).webkitSpeechRecognition;
  if (iOSRecognition) {
    console.log("Using iOS speech recognition");
    return iOSRecognition;
  }

  // Fall back to standard implementations
  return (window as any).SpeechRecognition ||
         (window as any).webkitSpeechRecognition ||
         (window as any).mozSpeechRecognition ||
         (window as any).msSpeechRecognition;
};

export const isIOSDevice = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent) && !(window as any).MSStream;
};

export const checkMicrophonePermission = async () => {
  try {
    console.log("Checking microphone permission...");
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // Important: Stop all tracks after checking permission
    stream.getTracks().forEach(track => track.stop());
    console.log("Microphone permission granted");
    return true;
  } catch (error) {
    console.error("Microphone permission error:", error);
    return false;
  }
};