import { motion, AnimatePresence } from "framer-motion";

interface ChickenAvatarProps {
  isThinking: boolean;
  currentMessage: string;
}

const ChickenAvatar = ({ isThinking, currentMessage }: ChickenAvatarProps) => {
  // Function to remove asterisks from text
  const cleanMessage = (message: string) => {
    return message.replace(/\*/g, '').replace(/---PLAN_UPDATES---[\s\S]*$/, '').trim();
  };

  return (
    <div className="absolute top-4 left-1/3 transform -translate-x-1/2 z-50">
      <div className="flex items-start gap-4">
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotateY: [0, 360],
            rotate: isThinking ? [0, 5, -5, 0] : 0,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            rotateY: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 5
            }
          }}
          className="relative"
        >
          <motion.div 
            className="w-48 h-48 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-xl transform-gpu perspective-1000"
            whileHover={{ 
              scale: 1.1,
              rotateY: 180,
              transition: { duration: 0.5 }
            }}
            whileTap={{ scale: 0.95 }}
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            <motion.div
              className="text-8xl select-none"
              animate={{ 
                rotate: isThinking ? [0, 10, -10, 0] : 0,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 0.5, 
                repeat: isThinking ? Infinity : 0,
                scale: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            >
              🐔
            </motion.div>
          </motion.div>
        </motion.div>
        
        <AnimatePresence mode="wait">
          {currentMessage && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-panel p-4 rounded-2xl max-w-[400px] text-left mt-4"
            >
              <div className="relative">
                {cleanMessage(currentMessage)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChickenAvatar;