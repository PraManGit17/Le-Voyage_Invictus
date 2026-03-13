module.exports = (destination, title, description) => `
You are a professional travel planner specializing in historical and heritage tourism.

Create a heritage exploration plan for:

Destination: ${destination}
Plan Title: ${title}
Plan Description: ${description}

Select the 6 most important historical and cultural landmarks tourists should visit.

Return ONLY JSON:

{
 "destination":"${destination}",
 "theme":"heritage",
 "places":[
  {
   "name":"Place name",
   "description":"Short engaging description about its history",
   "coordinates":{
      "lat":0,
      "lng":0
   },
   "bestTime":"Best time to visit",
   "duration":"Average visiting duration",
   "cost":"Entry cost or Free",
   "activities":[
      "Heritage walk",
      "Photography",
      "Museum exploration"
   ],
   "special":"What makes this place historically important",
   "tips":[
      "Travel tip",
      "Another useful tip"
   ]
  }
 ]
}

Rules:
- Generate exactly 6 places
- Places must be historically important
- Coordinates must be realistic
- imageQuery must be a single PascalCase word
- Activities must match heritage tourism
- Tips must help travelers
- Return ONLY valid JSON
`;