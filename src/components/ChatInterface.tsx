import { MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatInterfaceProps {
  showChatbox: boolean;
  setShowChatbox: (show: boolean) => void;
  messages: Array<{ text: string; isAi: boolean }>;
  input: string;
  setInput: (input: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const ChatInterface = ({
  showChatbox,
  setShowChatbox,
  messages,
  input,
  setInput,
  handleSubmit,
}: ChatInterfaceProps) => {
  return (
    <>
      <button
        onClick={() => setShowChatbox(!showChatbox)}
        className="fixed bottom-4 left-4 z-50 bg-primary text-white p-4 rounded-full hover:opacity-90 transition-opacity"
      >
        <MessageSquare />
      </button>

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
                className={`chat-bubble ${
                  message.isAi ? "chat-bubble-ai" : "chat-bubble-user"
                }`}
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
    </>
  );
};

export default ChatInterface;