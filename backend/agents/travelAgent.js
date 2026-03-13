// const Groq = require("groq-sdk");

// const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY_DP
// });

// const generateDiscoveries = async ({ states, cities, tripTypes }) => {

//   const prompt = `
// User is planning a trip in India.

// States:
// ${states.join(", ")}

// Cities:
// ${cities.join(", ")}

// Trip interests:
// ${tripTypes.join(", ")}

// Find famous tourist places, events and activities.

// Return JSON only in this format:

// {
//  "cities":[
//   {
//    "city":"cityName",
//    "places":[
//     {
//      "name":"place name",
//      "location":"area or landmark",
//      "description":"short engaging description",
//      "rating":4.5,
//      "cost":"₹200",
//      "type":"heritage/nature/adventure/event"
//     }
//    ]
//   }
//  ]
// }

// Rules:

// - Each city must have 4 places
// - Use real famous places
// - rating between 4.0 and 5.0
// - cost should be realistic
// - description under 30 words
// `;

//   const completion = await groq.chat.completions.create({
//     model: "llama-3.3-70b-versatile",
//     messages: [{ role: "user", content: prompt }],
//     temperature: 0.6,
//     response_format: { type: "json_object" }
//   });

//   return JSON.parse(completion.choices[0].message.content);
// };

// module.exports = { generateDiscoveries };

const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const generateTripData = async ({ mode, states, cities, tripTypes, places }) => {

  let prompt = "";

  // -------- DISCOVER MODE --------

  if (mode === "discover") {

    prompt = `
User is planning a trip in India.

States:
${states.join(", ")}

Cities:
${cities.join(", ")}

Trip interests:
${tripTypes.join(", ")}

Find famous tourist places, events and activities.

Return JSON only in this format:

{
 "cities":[
  {
   "city":"cityName",
   "places":[
    {
     "name":"place name",
     "location":"area or landmark",
     "description":"short engaging description",
     "rating":"give a approx rating from your search",
     "cost":"give a proper estimate from your search",
     "type":"heritage/nature/adventure/event"
    }
   ]
  }
 ]
}

Rules:
- Each city must have 4 places
- Use real famous places
- rating between 4.0 and 5.0
- cost realistic
- description under 30 words
`;
  }

  // -------- FOOD MODE --------

  if (mode === "food") {

    prompt = `
User is travelling in India.

States:
${states.join(", ")}

Cities:
${cities.join(", ")}

Selected tourist places:
${places?.map(p => p.name).join(", ")}

Suggest local food options.

Return JSON only in this format:

{
 "cities":[
  {
   "city":"cityName",
   "foods":[
    {
     "name":"food name",
     "category":"street food/local dish/fine dining/dessert/cafe/continental",
     "description":"short description",
     "priceRange":"give a proper estimate from your search"
    }
   ]
  }
 ]
}

Rules:

- Each city must have 10 food options
- Include street food, local cuisine, desserts, cafes
- Must include famous local dishes
- description under 20 words
`;
  }

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    response_format: { type: "json_object" }
  });

  return JSON.parse(completion.choices[0].message.content);
};

module.exports = { generateTripData };