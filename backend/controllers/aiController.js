// const Groq = require("groq-sdk");

// const getTopAttractions = async (req, res) => {
//   try {
//     const { city, interests } = req.body;

//     if (!city) {
//       return res.status(400).json({ message: "City is required" });
//     }

//     const groq = new Groq({
//       apiKey: process.env.GROQ_API_KEY,
//     });

//     const interestText =
//       interests && interests.length
//         ? interests.join(", ")
//         : "general tourism";

//     const prompt = `List the top 10 tourist attractions in ${city} based on the user's interests: ${interestText}.

// Return the response strictly in this JSON format:

// {
//   "city": "${city}",
//   "attractions": [
//     {
//       "name": "Attraction Name",
//       "category": "Type of attraction (food, nature, adventure, culture, shopping, etc.)",
//       "cost": "Estimated entry fee or Free",
//       "location": "Area, City, Country",
//       "description": "1-2 sentence explanation of why this attraction matches the user's interests"
//     }
//   ]
// }

// Requirements:
// - Prioritize attractions matching: ${interestText}
// - Include exactly 10 attractions
// - Provide estimated entry cost
// - Provide detailed location
// - Keep description concise
// - Return ONLY valid JSON`;

//     const chatCompletion = await groq.chat.completions.create({
//       messages: [{ role: "user", content: prompt }],
//       model: "llama-3.1-8b-instant",
//       temperature: 0.3,
//       response_format: { type: "json_object" },
//     });

//     const responseContent = chatCompletion.choices[0].message.content;

//     const parsed = JSON.parse(responseContent);

//     res.status(200).json({
//       city,
//       attractions: parsed.attractions || [],
//     });

//   } catch (error) {
//     console.error("Groq API Error:", error);
//     res.status(500).json({
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

// module.exports = {
//   getTopAttractions,
// };

const Groq = require("groq-sdk");

const generateTravelIdeas = async (req, res) => {
  try {

    const { query } = req.body;

    if (!query) {
      return res.status(400).json({
        message: "Search query required"
      });
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    const prompt = `
User searched: "${query}"

Generate 3 creative travel itinerary ideas for this destination.

Each idea should represent a travel theme such as:
heritage, food, adventure, nightlife, nature, culture.

Return ONLY JSON in this format:

{
 "destination": "city or place",
 "ideas":[
  {
   "title":"Travel theme title",
   "description":"Short engaging description",
   "theme":"heritage/food/adventure/nature/etc",
   "estimatedDays":"1-3 days",
   "highlights":[
     "place1",
     "place2",
     "place3"
   ]
  }
 ]
}

Rules:
- Generate exactly 3 ideas
- Titles should sound like travel experiences
- Make them exciting and clickable
- Keep description under 25 words
`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const response = completion.choices[0].message.content;
    const parsed = JSON.parse(response);

    res.status(200).json(parsed);

  } catch (error) {

    console.error("Travel Idea AI Error:", error);

    res.status(500).json({
      message: "Failed to generate travel ideas",
      error: error.message
    });

  }
};

module.exports = {
  generateTravelIdeas
};