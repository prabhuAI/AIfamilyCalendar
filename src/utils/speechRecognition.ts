export const getSpeechRecognition = () => {
  // For iOS Chrome, we need to check if the API is actually available
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isChrome = /chrome|crios/.test(userAgent);
  const isIOS = /iphone|ipad|ipod/.test(userAgent) && !(window as any).MSStream;
  
  console.log("Browser detection:", { isChrome, isIOS });

  // Try to get the iOS-specific SpeechRecognition
  const iOSRecognition = (window as any).webkitSpeechRecognition;
  if (iOSRecognition) {
    if (isIOS && isChrome) {
      console.log("iOS Chrome detected - checking if speech recognition is actually available");
      // Additional check for iOS Chrome
      if (!(window as any).webkitSpeechRecognition?.prototype?.start) {
        console.log("Speech recognition API not fully available in iOS Chrome");
        return null;
      }
    }
    console.log("Using webkit speech recognition");
    return iOSRecognition;
  }

  // Fall back to standard implementations
  const recognition = (window as any).SpeechRecognition ||
                     (window as any).webkitSpeechRecognition ||
                     (window as any).mozSpeechRecognition ||
                     (window as any).msSpeechRecognition;
                     
  console.log("Speech recognition availability:", !!recognition);
  return recognition;
};

export const isIOSDevice = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(userAgent) && !(window as any).MSStream;
  const isChrome = /chrome|crios/.test(userAgent);
  console.log("Device detection:", { isIOS, isChrome, userAgent });
  return isIOS;
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