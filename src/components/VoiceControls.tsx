import { Mic, MicOff } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

interface VoiceControlsProps {
  isListening: boolean;
  setIsListening: (value: boolean) => void;
  onStopListening: (transcript: string) => void;
  transcript: string;
}

const VoiceControls = ({ isListening, setIsListening, onStopListening, transcript }: VoiceControlsProps) => {
  useEffect(() => {
    let recognition: SpeechRecognition | null = null;

    if (isListening) {
      recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        console.log('Transcript:', transcript);
        if (event.results[0].isFinal) {
          onStopListening(transcript);
          setIsListening(false);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.start();
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [isListening, onStopListening, setIsListening]);

  const handleStopListening = () => {
    setIsListening(false);
    if (transcript.trim()) {
      onStopListening(transcript);
    }
  };

  return (
    <motion.div
      className="fixed bottom-8 left-1/3 transform -translate-x-1/2 z-50"
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