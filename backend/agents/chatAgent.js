const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY_DP
});

const chatWithTripAgent = async (itinerary, userMessage) => {

const prompt = `
You are an intelligent travel assistant helping a user refine their trip itinerary.

You already generated this itinerary.

ITINERARY CONTEXT
${JSON.stringify(itinerary)}

USER MESSAGE
"${userMessage}"

Your responsibilities:
- answer questions about the itinerary
- suggest improvements
- provide travel advice
- suggest food or hotel options

Rules:

You MUST return a valid JSON object.

If tools are required respond with JSON:

{
 "tool":"transport | restaurant | accommodation",
 "parameters":{}
}

If tools are NOT required respond with JSON:

{
 "reply":"your helpful response"
}

Return JSON only.
`;

const completion = await groq.chat.completions.create({
  model: "llama-3.3-70b-versatile",
  messages: [
    {
      role: "user",
      content: prompt
    }
  ],
  response_format: { type: "json_object" }
});

return JSON.parse(completion.choices[0].message.content);

};

module.exports = chatWithTripAgent;