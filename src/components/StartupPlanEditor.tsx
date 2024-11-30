import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { toast } from "sonner";
import { Share2 } from "lucide-react";

interface StartupPlan {
  id?: string;
  name: string;
  description: string;
  target_market: string;
  competitors: string[];
  unique_value: string;
  is_public: boolean;
}

const StartupPlanEditor = () => {
  const { userId } = useAuth();
  const [plan, setPlan] = useState<StartupPlan>({
    name: "",
    description: "",
    target_market: "",
    competitors: [],
    unique_value: "",
    is_public: false,
  });

  const savePlan = async () => {
    try {
      const { error } = await supabase.from("startup_plans").upsert({
        ...plan,
        user_id: userId,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
      toast.success("Startup plan saved!");
    } catch (error) {
      console.error("Error saving plan:", error);
      toast.error("Failed to save startup plan");
    }
  };

  return (
    <div className="space-y-4 bg-card p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Startup Plan</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={plan.is_public}
              onCheckedChange={(checked) => setPlan({ ...plan, is_public: checked })}
            />
            <span className="text-sm text-muted-foreground">Public</span>
          </div>
          <Button onClick={savePlan}>
            <Share2 className="mr-2 h-4 w-4" />
            Save Plan
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Startup Name</label>
          <Input
            value={plan.name}
            onChange={(e) => setPlan({ ...plan, name: e.target.value })}
            placeholder="Enter your startup name"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <Textarea
            value={plan.description}
            onChange={(e) => setPlan({ ...plan, description: e.target.value })}
            placeholder="What does your startup do?"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Target Market</label>
          <Textarea
            value={plan.target_market}
            onChange={(e) => setPlan({ ...plan, target_market: e.target.value })}
            placeholder="Who are your target customers?"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Competitors</label>
          <Input
            value={plan.competitors.join(", ")}
            onChange={(e) => setPlan({ ...plan, competitors: e.target.value.split(",").map(s => s.trim()) })}
            placeholder="Enter competitors (comma-separated)"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Unique Value Proposition</label>
          <Textarea
            value={plan.unique_value}
            onChange={(e) => setPlan({ ...plan, unique_value: e.target.value })}
            placeholder="What makes your startup unique?"
          />
        </div>
      </div>
    </div>
  );
};

export default StartupPlanEditor;