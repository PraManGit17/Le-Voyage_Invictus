module.exports = (destination, title, description) => `
You are a culinary travel expert.

Create a food exploration plan for:

Destination: ${destination}
Plan Title: ${title}
Description: ${description}

Select the 6 best food locations or food experiences in this city.

Return JSON:

{
 "destination":"${destination}",
 "theme":"food",
 "places":[
  {
   "name":"Food location or restaurant",
   "description":"Short description about the food specialty",
   "coordinates":{
      "lat":0,
      "lng":0
   },
   "bestTime":"Best time to visit for food",
   "duration":"Average time spent",
   "cost":"Average meal cost",
   "activities":[
      "Street food tasting",
      "Local cuisine experience",
      "Food photography"
   ],
   "special":"Signature dish or specialty",
   "tips":[
      "Best dish to try",
      "Avoid peak hours"
   ]
  }
 ]
}

Rules:
- Generate exactly 6 food locations
- Include street food and restaurants
- imageQuery should represent a famous dish or location
- Coordinates must be accurate
- JSON only
`;