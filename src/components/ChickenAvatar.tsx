import { motion, AnimatePresence } from "framer-motion";
import Lottie from "react-lottie-player";
import chickenAnimation from "../assets/chicken-animation.json";

interface ChickenAvatarProps {
  isThinking: boolean;
  currentMessage: string;
}

const ChickenAvatar = ({ isThinking, currentMessage }: ChickenAvatarProps) => {
  return (
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
          {currentMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="absolute -top-32 right-0 glass-panel p-4 rounded-2xl max-w-[300px] text-left"
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