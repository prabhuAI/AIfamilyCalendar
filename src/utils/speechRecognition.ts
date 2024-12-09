export const getSpeechRecognition = () => {
  return (window as any).webkitSpeechRecognition ||
         (window as any).SpeechRecognition ||
         (window as any).mozSpeechRecognition ||
         (window as any).msSpeechRecognition;
};

export const isIOSDevice = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
};

export const checkMicrophonePermission = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    return false;
  }
};