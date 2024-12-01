import { motion } from "framer-motion";
import { useAuth } from "@clerk/clerk-react";
import { useRef, useState } from "react";
import AuthWrapper from "../components/AuthWrapper";
import StartupPlanEditor from "../components/StartupPlanEditor";
import AiInteraction from "../components/AiInteraction";

const Index = () => {
  const [currentPlan, setCurrentPlan] = useState(null);
  const startupPlanRef = useRef(null);

  const handlePlanUpdate = (updates: any) => {
    if (startupPlanRef.current) {
      startupPlanRef.current.updatePlanFromAI(updates);
    }
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

            <div className="relative flex flex-row items-start justify-between gap-8">
              <div className="w-1/2">
                <AiInteraction currentPlan={currentPlan} onPlanUpdate={handlePlanUpdate} />
              </div>

              <div className="w-1/2">
                <StartupPlanEditor 
                  onPlanUpdate={setCurrentPlan}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AuthWrapper>
  );
};

export default Index;