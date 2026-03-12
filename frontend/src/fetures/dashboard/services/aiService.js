import { tripApi } from '../api/tripApi';

export const aiService = {
  // This is the "Brain" that the Dashboard calls
  getSmartRecommendation: async (userPrompt, currentBudget) => {
    // 1. Call the API layer
    const rawData = await tripApi.postToAI(userPrompt);

    // 2. Add Business Logic (e.g., check if the user is over budget)
    const isOverBudget = currentBudget > 5000;
    
    return {
      message: rawData.answer,
      warning: isOverBudget ? "Note: This might exceed your $5k limit." : null,
      timestamp: new Date().toLocaleTimeString()
    };
  }
};