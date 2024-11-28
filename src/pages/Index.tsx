import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Sparkles, Mic, MicOff } from "lucide-react";
import Lottie from "react-lottie-player";
import { GoogleGenerativeAI } from "@google/generative-ai";
import chickenAnimation from "../assets/chicken-animation.json";
import { toast } from "sonner";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const Index = () => {
  const [messages, setMessages] = useState<Array<{ text: string; isAi: boolean }>>([
    { text: "Hey there! I'm Don Pollo, your meme-worthy startup advisor. Ready to disrupt some markets? 🐔", isAi: true },
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  // Speech recognition setup
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      toast.error("Speech recognition is not supported in your browser");
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

    recognition.onerror = (event: any) => {
      console.error(event.error);
      setIsListening(false);
      toast.error("Error with speech recognition");
    };

    return () => {
      recognition.stop();
    };
  }, []);

  const toggleListening = () => {
    const recognition = new (window as any).webkitSpeechRecognition();
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
    setIsListening(!isListening);
  };

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
          
          <div className="relative w-64 h-64 mx-auto mb-8">
            <Lottie
              loop
              animationData={chickenAnimation}
              play={isThinking || isListening}
              style={{ width: "100%", height: "100%" }}
            />
          </div>

          <button
            onClick={toggleListening}
            className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-full font-medium hover:opacity-90 transition-opacity mb-8"
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
          </button>
        </motion.div>

        <div className="glass-panel p-6 mb-8">
          <div className="space-y-4 mb-6 max-h-[500px] overflow-y-auto">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`chat-bubble ${message.isAi ? "chat-bubble-ai" : "chat-bubble-user"}`}
              >
                {message.text}
              </motion.div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Share your groundbreaking idea..."
              className="flex-1 px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-xl hover:opacity-90 transition-opacity"
            >
              <MessageSquare className="h-5 w-5" />
            </button>
          </form>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>Powered by memes and the spirit of Silicon Valley</p>
        </div>
      </div>
    </div>
  );
};

export default Index;