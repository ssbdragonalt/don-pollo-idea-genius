import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Sparkles, TrendingUp } from "lucide-react";

const Index = () => {
  const [messages, setMessages] = useState<Array<{ text: string; isAi: boolean }>>([
    { text: "Hey there! I'm Don Pollo, your meme-worthy startup advisor. Ready to disrupt some markets? 🐔", isAi: true },
  ]);
  const [input, setInput] = useState("");

  const generateStartupIdea = () => {
    const trends = ["AI", "Web3", "Sustainability", "Mental Health"];
    const problems = ["productivity", "social connection", "education", "entertainment"];
    const solutions = ["marketplace", "platform", "assistant", "community"];

    const trend = trends[Math.floor(Math.random() * trends.length)];
    const problem = problems[Math.floor(Math.random() * problems.length)];
    const solution = solutions[Math.floor(Math.random() * solutions.length)];

    const idea = `Here's your next billion-dollar idea: A ${trend}-powered ${solution} for ${problem}. Think 'Uber meets Tesla' but for ${problem}!`;
    
    setMessages([...messages, { text: idea, isAi: true }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages([...messages, { text: input, isAi: false }]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "That's literally genius! Have you considered adding blockchain to it?",
        "Wow, that's like Airbnb meets SpaceX, but better!",
        "Your TAM is literally infinite. VCs will love this!",
      ];
      const response = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, { text: response, isAi: true }]);
    }, 1000);
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
          <button
            onClick={generateStartupIdea}
            className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-full font-medium hover:opacity-90 transition-opacity animate-float"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Generate Startup Idea
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