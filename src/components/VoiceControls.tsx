import { Mic, MicOff } from "lucide-react";
import { motion } from "framer-motion";

interface VoiceControlsProps {
  isListening: boolean;
  setIsListening: (value: boolean) => void;
  onStopListening: (transcript: string) => void;
  transcript: string;
}

const VoiceControls = ({ isListening, setIsListening, onStopListening, transcript }: VoiceControlsProps) => {
  const handleStopListening = () => {
    setIsListening(false);
    if (transcript.trim()) {
      onStopListening(transcript);
    }
  };

  return (
    <motion.button
      onClick={() => isListening ? handleStopListening() : setIsListening(true)}
      className={`fixed bottom-20 transform -translate-x-1/2 inline-flex items-center px-8 py-4 ${
        isListening ? "bg-destructive" : "bg-primary"
      } text-white rounded-full font-medium hover:opacity-90 transition-opacity shadow-lg`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{ left: "50%" }}
    >
      {isListening ? (
        <>
          <MicOff className="mr-2 h-5 w-5" />
          Stop Listening
        </>
      ) : (
        <>
          <Mic className="mr-2 h-5 w-5" />
          Start Talking
        </>
      )}
    </motion.button>
  );
};

export default VoiceControls;