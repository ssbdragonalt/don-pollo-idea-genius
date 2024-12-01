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
      if (!userId) {
        toast.error("Please sign in to save your plan");
        return;
      }

      // Remove 'user_' prefix and format as UUID
      const formattedUserId = userId.replace('user_', '');
      console.log('Formatted user ID:', formattedUserId);

      const { data: existingPlan, error: fetchError } = await supabase
        .from("startup_plans")
        .select("id")
        .eq("user_id", formattedUserId)
        .single();

      console.log('Existing plan:', existingPlan);
      console.log('Fetch error:', fetchError);

      const planId = existingPlan?.id || crypto.randomUUID();
      console.log('Using plan ID:', planId);

      const { error } = await supabase.from("startup_plans").upsert({
        id: planId,
        user_id: formattedUserId,
        ...plan,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }

      toast.success("Startup plan saved!");
    } catch (error) {
      console.error("Error saving plan:", error);
      toast.error("Failed to save startup plan");
    }
  };

  // Load existing plan on component mount
  useEffect(() => {
    const loadPlan = async () => {
      if (!userId) return;

      const formattedUserId = userId.replace('user_', '');
      const { data, error } = await supabase
        .from("startup_plans")
        .select("*")
        .eq("user_id", formattedUserId)
        .single();

      if (error) {
        console.error("Error loading plan:", error);
        return;
      }

      if (data) {
        console.log('Loaded plan:', data);
        setPlan(data);
      }
    };

    loadPlan();
  }, [userId]);

  // Function to update plan from AI suggestions
  const updatePlanFromAI = async (suggestions: Partial<StartupPlan>) => {
    console.log('Updating plan with AI suggestions:', suggestions);
    const updatedPlan = { ...plan, ...suggestions };
    setPlan(updatedPlan);
    await savePlan();
  };

  return (
    <div className="space-y-4 bg-card p-6 rounded-lg shadow-lg animate-fadeIn">
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
          <Button onClick={savePlan} variant="default">
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
            className="glass-panel"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <Textarea
            value={plan.description}
            onChange={(e) => setPlan({ ...plan, description: e.target.value })}
            placeholder="What does your startup do?"
            className="glass-panel min-h-[100px]"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Target Market</label>
          <Textarea
            value={plan.target_market}
            onChange={(e) => setPlan({ ...plan, target_market: e.target.value })}
            placeholder="Who are your target customers?"
            className="glass-panel min-h-[100px]"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Competitors</label>
          <Input
            value={plan.competitors.join(", ")}
            onChange={(e) => setPlan({ ...plan, competitors: e.target.value.split(",").map(s => s.trim()) })}
            placeholder="Enter competitors (comma-separated)"
            className="glass-panel"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Unique Value Proposition</label>
          <Textarea
            value={plan.unique_value}
            onChange={(e) => setPlan({ ...plan, unique_value: e.target.value })}
            placeholder="What makes your startup unique?"
            className="glass-panel min-h-[100px]"
          />
        </div>
      </div>
    </div>
  );
};

export default StartupPlanEditor;