import { motion, AnimatePresence } from "framer-motion";

interface ChickenAvatarProps {
  isThinking: boolean;
  currentMessage: string;
}

const ChickenAvatar = ({ isThinking, currentMessage }: ChickenAvatarProps) => {
  return (
    <div className="absolute top-32 left-1/2 transform -translate-x-1/2 z-50">
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
        <motion.div 
          className="w-48 h-48 bg-primary rounded-full flex items-center justify-center transform hover:scale-105 transition-transform shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.span 
            className="text-7xl select-none"
            animate={{ rotate: isThinking ? [0, 10, -10, 0] : 0 }}
            transition={{ duration: 0.5, repeat: isThinking ? Infinity : 0 }}
          >
            🐔
          </motion.span>
        </motion.div>
        
        <AnimatePresence>
          {currentMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="absolute -top-32 right-0 glass-panel p-4 rounded-2xl max-w-[300px] text-left bg-white/20 backdrop-blur-sm border border-white/10 shadow-xl"
            >
              <div className="relative">
                {currentMessage}
                <div className="absolute -bottom-8 right-8 w-0 h-0 border-l-[10px] border-l-transparent border-t-[20px] border-white/20 border-r-[10px] border-r-transparent" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ChickenAvatar;