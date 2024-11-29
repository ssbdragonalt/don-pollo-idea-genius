import { motion, AnimatePresence } from "framer-motion";

interface ChickenAvatarProps {
  isThinking: boolean;
  currentMessage: string;
}

const ChickenAvatar = ({ isThinking, currentMessage }: ChickenAvatarProps) => {
  return (
    <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50">
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