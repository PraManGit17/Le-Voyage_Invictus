import { useState } from 'react';

export const useAgent = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const sendMessageToAgent = async (userPrompt, currentItinerary) => {
    setIsProcessing(true);
    
    // In a real app, this is where Layer 3 (API) would call your backend
    // For now, we simulate an agentic thought process
    try {
      console.log("Agent is reasoning about:", userPrompt);
      // Simulate API Delay
      await new Promise(res => setTimeout(res, 1500));
      
      return {
        reply: "I've updated the itinerary. I moved Shibuya Sky to 5:00 PM to ensure you catch the sunset, as requested.",
        action: "UPDATE_ITINERARY", // This tells the UI to refresh
        payload: { /* new itinerary data */ }
      };
    } finally {
      setIsProcessing(false);
    }
  };

  return { sendMessageToAgent, isProcessing };
};