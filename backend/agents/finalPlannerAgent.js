const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY_DP
});

const generateFinalPlan = async (activityPlan, toolResults) => {

  const prompt = `
Create final itinerary.

Activity Plan:
${JSON.stringify(activityPlan)}

Transport Options:
${JSON.stringify(toolResults.transport)}

Restaurants:
${JSON.stringify(toolResults.restaurants)}

Hotels:
${JSON.stringify(toolResults.hotels)}

Rules:
- Use provided transport options only
- Pick restaurants serving recommended dishes
- Choose hotels near activity areas

Return JSON itinerary.
`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  });

  return JSON.parse(completion.choices[0].message.content);

};

module.exports = generateFinalPlan;