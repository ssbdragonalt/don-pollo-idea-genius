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
    <motion.div
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.button
        onClick={() => isListening ? handleStopListening() : setIsListening(true)}
        className={`glass-panel inline-flex items-center px-8 py-4 ${
          isListening ? "bg-destructive text-white" : "bg-primary text-white"
        } rounded-full font-medium hover:opacity-90 transition-all shadow-lg`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
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
    </motion.div>
  );
};

export default VoiceControls;