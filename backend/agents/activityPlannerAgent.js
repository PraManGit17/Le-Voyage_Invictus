// const Groq = require("groq-sdk");

// const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY
// });

// const generateActivityPlan = async (tripData) => {

//   const {
//     states,
//     cities,
//     tripTypes,
//     discoveries,
//     food,
//     accom,
//     travel,
//     dates,
//     specialNotes,
//     budget,
//   } = tripData;


//   const prompt = `
// You are a professional travel planning AI.

// Your task is to generate a highly realistic day-wise travel activity plan.

// You must carefully analyze the user's preferences and optimize the itinerary.

// -------------------------
// USER TRIP DATA
// -------------------------

// States:
// ${states.join(", ")}

// Cities:
// ${cities.join(", ")}

// Trip Interests:
// ${tripTypes.join(", ")}

// Travel Modes Preferred:
// ${travel.join(", ")}

// Accommodation Preferences:
// ${accom.join(", ")}

// Trip Dates:
// ${dates.join(", ")}

// Budget:
// ${budget}

// Special Notes:
// ${specialNotes || "None"}

// -------------------------
// AVAILABLE DISCOVERIES
// -------------------------

// ${JSON.stringify(discoveries)}

// -------------------------
// AVAILABLE FOOD EXPERIENCES
// -------------------------

// ${JSON.stringify(food)}

// -------------------------
// PLANNING OBJECTIVE
// -------------------------

// Create a balanced travel itinerary that:

// • minimizes unnecessary travel distance  
// • groups nearby discoveries together  
// • reduces long travel segments between activities  
// • respects the user's budget  
// • matches user interests  
// • balances tourism, food, and leisure
// • consider their specialNotes too

// Think of this like route optimization similar to a shortest-path or minimal travel effort approach.

// If multiple cities are selected:
// prioritize logical movement between locations and avoid unnecessary backtracking.

// -------------------------
// DAILY STRUCTURE
// -------------------------

// Each day must contain the following periods:

// Morning  
// Afternoon  
// Evening  
// Night  

// For each activity include:

// • time  
// • period of day  
// • activity name  
// • location  
// • activity type (tourism, food, event, exploration, relaxation)  
// • approximate duration OR cost  
// • travel tips for that activity  

// Activities should include:

// • visiting tourist attractions  
// • exploring local areas  
// • trying recommended foods  
// • relaxing or cultural experiences  

// Do NOT include transport booking yet.

// -------------------------
// ACCOMMODATION SUGGESTIONS
// -------------------------

// Based on the accommodation preferences (${accom.join(", ")}), suggest the best area in each city to stay.

// Examples:
// • luxury → premium districts or waterfront areas
// • hostels/backpacking → vibrant or budget districts
// • homestay → residential cultural neighborhoods

// Return only suggested areas, not specific hotels.

// -------------------------
// ADDITIONAL SUGGESTIONS
// -------------------------

// Also generate a list of optional activities the traveler could try if they have extra time.

// Examples:
// • nearby attractions
// • local experiences
// • hidden gems
// • cultural spots
// • markets or cafes

// -------------------------
// TRAVEL ADVISORIES
// -------------------------

// Provide helpful travel guidelines covering:

// • local etiquette
// • best time to visit places
// • safety advice
// • weather considerations
// • cultural tips

// These should apply to the overall trip.

// -------------------------
// FOLLOW-UP QUESTIONS
// -------------------------

// Generate 3–4 questions that encourage the user to refine their trip plan.

// These questions should ask about:

// • travel mode preferences
// • accommodation choices
// • restaurant recommendations
// • specific experiences they may want

// Example topics:
// - transport between cities
// - hotel type
// - local food recommendations
// - guided tours or experiences

// -------------------------
// OUTPUT FORMAT
// -------------------------

// Return STRICT JSON only.

// {
//  "days":[
//    {
//      "day":1,
//      "city":"",
//      "date":"",

//      "activities":[
//        {
//          "time":"",
//          "period":"Morning",
//          "activity":"",
//          "location":"",
//          "type":"",
//          "duration":"",
//          "cost":"",
//          "tips":""
//        }
//      ],

//      "foodsToTry":[
//        {
//          "dish":"",
//          "suggestedArea":"",
//          "description":""
//        }
//      ],

//      "suggestedStayArea":""
//    }
//  ],

//  "additionalSuggestions":[
//    {
//      "place":"",
//      "city":"",
//      "description":""
//    }
//  ],

//  "travelAdvisories":[
//    {
//      "tip":""
//    }
//  ],

//  "followUpQuestions":[
//    {
//      "question":""
//    }
//  ]
// }

// Return valid JSON only.
// Do not include explanations outside the JSON.
// `;

//   const completion = await groq.chat.completions.create({
//     model: "llama-3.3-70b-versatile",
//     messages: [{ role: "user", content: prompt }],
//     response_format: { type: "json_object" }
//   });

//   return JSON.parse(completion.choices[0].message.content);
// };

// module.exports = generateActivityPlan;

const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const generateActivityPlan = async (tripData) => {

  // Safe destructuring with defaults
  const {
    states = [],
    cities = [],
    tripTypes = [],
    discoveries = [],
    food = [],
    accom = [],
    travel = [],
    dates = [],
    specialNotes = "",
    budget = 0
  } = tripData || {};

  const prompt = `
You are a professional travel planning AI.

Your task is to generate a highly realistic day-wise travel activity plan.

Carefully analyze the user's preferences and optimize the itinerary.

-------------------------
USER TRIP DATA
-------------------------

States:
${states.length ? states.join(", ") : "Not specified"}

Cities:
${cities.length ? cities.join(", ") : "Not specified"}

Trip Interests:
${tripTypes.length ? tripTypes.join(", ") : "General travel"}

Preferred Travel Modes:
${travel.length ? travel.join(", ") : "Any"}

Accommodation Preferences:
${accom.length ? accom.join(", ") : "Any"}

Trip Dates:
${dates.length ? dates.join(", ") : "Flexible"}

Budget:
${budget}

Special Notes:
${specialNotes || "None"}

-------------------------
AVAILABLE DISCOVERIES
-------------------------

${JSON.stringify(discoveries, null, 2)}

-------------------------
AVAILABLE FOOD EXPERIENCES
-------------------------

${JSON.stringify(food, null, 2)}

-------------------------
PLANNING OBJECTIVE
-------------------------

Create a balanced travel itinerary that:

• minimizes unnecessary travel distance  
• groups nearby discoveries together  
• reduces long travel segments between activities  
• respects the user's budget  
• matches user interests  
• balances tourism, food, and leisure  
• considers the user's special notes

Think like route optimization similar to shortest-path planning.

If multiple cities are selected:
plan travel logically and avoid unnecessary backtracking.

-------------------------
DAILY STRUCTURE
-------------------------

Each day must include:

Morning  
Afternoon  
Evening  
Night  

For each activity include:

• time  
• period of day  
• activity name  
• location  
• activity type (tourism, food, exploration, relaxation, event)  
• approximate duration OR cost  
• helpful tips  

Activities should include:

• visiting tourist attractions  
• exploring local areas  
• trying recommended foods  
• cultural or leisure experiences  

IMPORTANT:
Do NOT include transport booking yet.

-------------------------
ACCOMMODATION SUGGESTIONS
-------------------------

Based on the accommodation preferences (${accom.length ? accom.join(", ") : "Any"}), suggest the best area to stay in each city.

Examples:

Luxury → premium districts  
Hostel → vibrant budget areas  
Homestay → residential cultural neighborhoods  

Only return suggested stay areas, not specific hotels.

-------------------------
ADDITIONAL SUGGESTIONS
-------------------------

Also provide optional activities travelers could try if they have extra time.

Examples:

• hidden gems  
• nearby attractions  
• local markets  
• cafes  
• cultural experiences  

-------------------------
TRAVEL ADVISORIES
-------------------------

Provide travel guidelines such as:

• local etiquette  
• safety advice  
• best visiting times  
• weather considerations  
• cultural tips  

These apply to the overall trip.

-------------------------
FOLLOW-UP QUESTIONS
-------------------------

Generate 3-4 questions that help refine the trip plan.

Topics may include:

• preferred transport options  
• accommodation style  
• restaurant recommendations  
• guided experiences  

-------------------------
OUTPUT FORMAT
-------------------------

Return STRICT JSON only.

{
 "days":[
   {
     "day":1,
     "city":"",
     "date":"",
     "activities":[
       {
         "time":"",
         "period":"Morning",
         "activity":"",
         "location":"",
         "type":"",
         "duration":"",
         "cost":"",
         "tips":""
       }
     ],
     "foodsToTry":[
       {
         "dish":"",
         "suggestedArea":"",
         "description":""
       }
     ],
     "suggestedStayArea":""
   }
 ],

 "additionalSuggestions":[
   {
     "place":"",
     "city":"",
     "description":""
   }
 ],

 "travelAdvisories":[
   {
     "tip":""
   }
 ],

 "followUpQuestions":[
   {
     "question":""
   }
 ]
}

Return valid JSON only.
Do not include explanations outside the JSON.
`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: "You are an expert travel planner AI."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.4,
    response_format: { type: "json_object" }
  });

  const content = completion.choices[0].message.content;

  try {
    return JSON.parse(content);
  } catch (error) {
    console.error("Failed to parse AI response:", content);
    throw new Error("Invalid JSON returned by AI");
  }
};

module.exports = generateActivityPlan;