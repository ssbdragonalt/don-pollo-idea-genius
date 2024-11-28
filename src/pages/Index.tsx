import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

          <div className="relative">
            {/* 3D Chicken with Speech Bubble */}
            <div className="fixed bottom-20 right-20 z-50">
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: isThinking ? [0, 5, -5, 0] : 0,
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative"
              >
                <div className="w-40 h-40">
                  <Lottie
                    loop
                    animationData={chickenAnimation}
                    play={true}
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
                
                <AnimatePresence>
                  {currentSpeechBubble && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 20 }}
                      className="absolute -top-32 right-0 glass-panel p-4 rounded-2xl max-w-[300px] text-left"
                    >
                      <div className="relative">
                        {currentSpeechBubble}
                        <div className="absolute -bottom-8 right-8 w-0 h-0 border-l-[10px] border-l-transparent border-t-[20px] border-white/20 border-r-[10px] border-r-transparent" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <button
                onClick={() => setIsListening(!isListening)}
                className={`mt-4 inline-flex items-center px-6 py-3 ${
                  isListening ? "bg-destructive" : "bg-primary"
                } text-white rounded-full font-medium hover:opacity-90 transition-opacity`}
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
            </div>

            {/* Toggle Chat Interface Button */}
            <button
              onClick={() => setShowChatbox(!showChatbox)}
              className="fixed bottom-4 left-4 z-50 bg-primary text-white p-4 rounded-full hover:opacity-90 transition-opacity"
            >
              <MessageSquare />
            </button>

            {/* Original Chat Interface */}
            <AnimatePresence>
              {showChatbox && (
                <motion.div
                  initial={{ opacity: 0, x: -300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -300 }}
                  className="fixed left-4 bottom-20 z-40 glass-panel p-6 w-96 max-h-[600px] overflow-y-auto"
                >
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

                  <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      type="submit"
                      className="px-6 py-2 bg-primary text-white rounded-xl hover:opacity-90 transition-opacity"
                    >
                      <MessageSquare className="h-5 w-5" />
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;