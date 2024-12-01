import { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { extractPlanUpdates } from '@/utils/aiUtils';
import ChatInterface from './ChatInterface';
import VoiceControls from './VoiceControls';
import ChickenAvatar from './ChickenAvatar';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

interface AiInteractionProps {
  currentPlan: any;
  onPlanUpdate: (updates: any) => void;
}

const AiInteraction = ({ currentPlan, onPlanUpdate }: AiInteractionProps) => {
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
      
      console.log('Current startup plan context:', currentPlan);
      
      const prompt = `You are Don Pollo, a quirky and meme-savvy startup advisor chicken. 
        Here's the current startup plan context:
        ${JSON.stringify(currentPlan || {})}
        
        Based on this context and the user's input, provide helpful startup advice and suggestions for improving the plan.
        If you notice any gaps in the plan, point them out.
        Keep your response under 150 words and include at least one emoji.
        
        IMPORTANT: If you have specific suggestions for updating the startup plan, include them in a JSON block at the end of your message like this:
        ---PLAN_UPDATES---
        {
          "name": "suggested name",
          "description": "suggested description"
        }
        
        User input: ${userInput}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      // Extract and apply plan updates
      const planUpdates = extractPlanUpdates(text);
      if (planUpdates) {
        console.log('Extracted plan updates:', planUpdates);
        await onPlanUpdate(planUpdates);
      }
      
      // Remove the JSON block from the displayed message
      text = text.replace(/---PLAN_UPDATES---[\s\S]*$/, '').trim();
      
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
    <div className="relative min-h-[700px] flex flex-col items-center">
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

      <ChatInterface
        showChatbox={showChatbox}
        setShowChatbox={setShowChatbox}
        messages={messages}
        input={input}
        setInput={setInput}
        handleSubmit={handleChatSubmit}
      />
    </div>
  );
};

export default AiInteraction;