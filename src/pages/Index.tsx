import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Mic, MicOff } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "sonner";
import ChickenAvatar from "../components/ChickenAvatar";
import ChatInterface from "../components/ChatInterface";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const Index = () => {
  const [messages, setMessages] = useState<Array<{ text: string; isAi: boolean }>>([
    { text: "Hey there! I'm Don Pollo, your meme-worthy startup advisor. Ready to disrupt some markets? 🐔", isAi: true },
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [currentSpeechBubble, setCurrentSpeechBubble] = useState("");
  const [showChatbox, setShowChatbox] = useState(false);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      toast.error("Speech recognition is not supported in your browser. Try Chrome!");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result) => result.transcript)
        .join("");
      setInput(transcript);
    };

    recognition.onend = () => {
      if (isListening) {
        handleSubmit({ preventDefault: () => {} } as any);
        setIsListening(false);
      }
    };

    if (isListening) {
      recognition.start();
    }

    return () => {
      recognition.stop();
    };
  }, [isListening]);

  const speak = async (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const generateResponse = async (userInput: string) => {
    try {
      setIsThinking(true);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `You are Don Pollo, a quirky and meme-savvy startup advisor chicken. 
        Respond to this user input in a fun, engaging way while providing actually useful startup advice: ${userInput}
        Keep your response under 100 words and include at least one emoji.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      setMessages(prev => [...prev, { text, isAi: true }]);
      setCurrentSpeechBubble(text);
      speak(text);
    } catch (error) {
      toast.error("Error generating response");
      console.error(error);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { text: input, isAi: false }]);
    setInput("");
    await generateResponse(input);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            The Next Big Thing™
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Don Pollo
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Your AI-powered startup advisor with a sense of humor
          </p>

          <div className="relative min-h-[500px] flex flex-col items-center justify-center gap-8">
            <ChickenAvatar 
              isThinking={isThinking}
              currentMessage={currentSpeechBubble}
            />

            <motion.button
              onClick={() => setIsListening(!isListening)}
              className={`mt-32 inline-flex items-center px-6 py-3 ${
                isListening ? "bg-destructive" : "bg-primary"
              } text-white rounded-full font-medium hover:opacity-90 transition-opacity shadow-lg`}
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
          </div>

          <ChatInterface
            showChatbox={showChatbox}
            setShowChatbox={setShowChatbox}
            messages={messages}
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Index;