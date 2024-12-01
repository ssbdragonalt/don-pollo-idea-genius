import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import { supabase } from "@/integrations/supabase/client";
import ChickenAvatar from "../components/ChickenAvatar";
import ChatInterface from "../components/ChatInterface";
import VoiceControls from "../components/VoiceControls";
import AuthWrapper from "../components/AuthWrapper";
import StartupPlanEditor from "../components/StartupPlanEditor";

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

  const generateResponse = async (userInput: string) => {
    try {
      setIsThinking(true);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      // Get the current startup plan state to provide context to the AI
      const formattedUserId = userId?.replace('user_', '');
      console.log('Getting startup plan for user:', formattedUserId);
      
      const { data: startupPlan, error: planError } = await supabase
        .from('startup_plans')
        .select('*')
        .eq('user_id', formattedUserId)
        .single();

      if (planError) {
        console.error('Error fetching startup plan:', planError);
      }

      console.log('Current startup plan:', startupPlan);

      const prompt = `You are Don Pollo, a quirky and meme-savvy startup advisor chicken. 
        Here's the current startup plan context:
        ${JSON.stringify(startupPlan || {})}
        
        Based on this context and the user's input, provide helpful startup advice and suggestions for improving the plan.
        If you notice any gaps in the plan, point them out.
        Keep your response under 150 words and include at least one emoji.
        
        IMPORTANT: If you have specific suggestions for updating the startup plan, include them in a JSON block at the end of your message like this:
        ---PLAN_UPDATES---
        {
          "name": "suggested name",
          "description": "suggested description",
          // ... other fields to update
        }
        
        User input: ${userInput}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      // Extract plan updates if they exist
      let planUpdates = null;
      const planUpdateMatch = text.match(/---PLAN_UPDATES---([\s\S]*)/);
      if (planUpdateMatch) {
        try {
          const jsonStr = planUpdateMatch[1].trim();
          planUpdates = JSON.parse(jsonStr);
          // Remove the plan updates section from the displayed message
          text = text.replace(/---PLAN_UPDATES---[\s\S]*/, '').trim();
          console.log('Extracted plan updates:', planUpdates);
          
          // Update the startup plan with AI suggestions
          if (planUpdates && Object.keys(planUpdates).length > 0) {
            const { error: updateError } = await supabase
              .from('startup_plans')
              .upsert({
                ...startupPlan,
                ...planUpdates,
                user_id: formattedUserId,
                updated_at: new Date().toISOString()
              });

            if (updateError) {
              console.error('Error updating startup plan:', updateError);
            } else {
              console.log('Successfully updated startup plan with AI suggestions');
              toast.success("Updated startup plan with AI suggestions! 🐔");
            }
          }
        } catch (error) {
          console.error('Error parsing plan updates:', error);
        }
      }
      
      const updatedMessages = [...messages, { text, isAi: true }];
      setMessages(updatedMessages);
      setCurrentSpeechBubble(text);

    } catch (error) {
      console.error('Error in generateResponse:', error);
      toast.error("Oops! My chicken brain had a hiccup 🐔");
    } finally {
      setIsThinking(false);
      setTranscript("");
    }
  };

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

  const handleSubmit = async (userInput: string) => {
    if (!userInput.trim()) return;

    const updatedMessages = [...messages, { text: userInput, isAi: false }];
    setMessages(updatedMessages);
    setInput("");
    await generateResponse(userInput);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(input);
  };

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
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

            <div className="relative min-h-[700px] flex flex-row items-start justify-between gap-8">
              <div className="w-1/2 relative">
                <ChickenAvatar 
                  isThinking={isThinking}
                  currentMessage={currentSpeechBubble}
                />

                <VoiceControls
                  isListening={isListening}
                  setIsListening={setIsListening}
                  onStopListening={handleSubmit}
                  transcript={transcript}
                />
              </div>

              <div className="w-1/2">
                <StartupPlanEditor />
              </div>
            </div>

            <ChatInterface
              showChatbox={showChatbox}
              setShowChatbox={setShowChatbox}
              messages={messages}
              input={input}
              setInput={setInput}
              handleSubmit={handleChatSubmit}
            />
          </motion.div>
        </div>
      </div>
    </AuthWrapper>
  );
};

export default Index;
