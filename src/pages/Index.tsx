import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import { supabase } from "@/integrations/supabase/client";
import ChickenAvatar from "../components/ChickenAvatar";
import ChatInterface from "../components/ChatInterface";
import VoiceControls from "../components/VoiceControls";
import AuthWrapper from "../components/AuthWrapper";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const Index = () => {
  const { userId } = useAuth();
  const [messages, setMessages] = useState<Array<{ text: string; isAi: boolean }>>([
    { text: "Hey there! I'm Don Pollo, your meme-worthy startup advisor. Ready to disrupt some markets? 🐔", isAi: true },
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [currentSpeechBubble, setCurrentSpeechBubble] = useState("");
  const [showChatbox, setShowChatbox] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [startupName, setStartupName] = useState<string | null>(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      toast.error("Speech recognition is not supported in your browser. Try Chrome!");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      const currentTranscript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result) => result.transcript)
        .join("");
      setTranscript(currentTranscript);
      setInput(currentTranscript);
    };

    recognition.onend = () => {
      if (isListening) {
        recognition.stop();
        setIsListening(false);
        if (transcript.trim()) {
          handleSubmit({ preventDefault: () => {} } as any);
        }
      }
    };

    if (isListening) {
      setTranscript("");
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

  const updateConversationSummary = async (messages: Array<{ text: string; isAi: boolean }>) => {
    if (!userId) return;

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const conversation = messages.map(m => `${m.isAi ? "Don Pollo" : "User"}: ${m.text}`).join("\n");
      const summaryPrompt = `Analyze this conversation and provide a brief summary of the startup idea or business context discussed. If a startup name is mentioned, extract it. Format: {summary: "brief summary", startupName: "name if found, or null"}
      
      Conversation:
      ${conversation}`;
      
      const result = await model.generateContent(summaryPrompt);
      const response = await result.response;
      const summaryText = response.text();
      
      try {
        const parsedSummary = JSON.parse(summaryText);
        
        if (parsedSummary.startupName) {
          setStartupName(parsedSummary.startupName);
        }

        const { error } = await supabase
          .from('conversation_summaries')
          .upsert({
            user_id: userId,
            startup_name: parsedSummary.startupName,
            summary: parsedSummary.summary,
            updated_at: new Date().toISOString()
          });

        if (error) throw error;
      } catch (parseError) {
        console.error('Failed to parse summary:', parseError);
        const { error } = await supabase
          .from('conversation_summaries')
          .upsert({
            user_id: userId,
            summary: summaryText,
            updated_at: new Date().toISOString()
          });

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error updating conversation summary:', error);
      toast.error("Failed to save conversation summary");
    }
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
      
      const updatedMessages = [...messages, { text, isAi: true }];
      setMessages(updatedMessages);
      setCurrentSpeechBubble(text);
      speak(text);

      await updateConversationSummary(updatedMessages);
    } catch (error) {
      toast.error("Oops! My chicken brain had a hiccup 🐔");
      console.error(error);
    } finally {
      setIsThinking(false);
      setTranscript("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    const updatedMessages = [...messages, { text: userMessage, isAi: false }];
    setMessages(updatedMessages);
    setInput("");
    await generateResponse(userMessage);
  };

  return (
    <AuthWrapper>
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

            <div className="relative min-h-[700px] flex flex-col items-center justify-center">
              <ChickenAvatar 
                isThinking={isThinking}
                currentMessage={currentSpeechBubble}
              />

              <VoiceControls
                isListening={isListening}
                setIsListening={setIsListening}
                onStopListening={handleSubmit}
              />
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
    </AuthWrapper>
  );
};

export default Index;