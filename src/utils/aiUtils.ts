export const extractPlanUpdates = (aiResponse: string) => {
  try {
    const updateMatch = aiResponse.match(/---PLAN_UPDATES---([\s\S]*?)(?=\n\n|$)/);
    if (!updateMatch) return null;
    
    const jsonStr = updateMatch[1].trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Error parsing AI response:', error);
    return null;
  }
};