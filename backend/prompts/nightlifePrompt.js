module.exports = (destination, title, description) => `
You are a nightlife travel planner.

Create a nightlife experience plan for:

Destination: ${destination}
Title: ${title}
Description: ${description}

Select 6 nightlife hotspots.

Return JSON:

{
 "destination":"${destination}",
 "theme":"nightlife",
 "places":[
  {
   "name":"Nightlife location",
   "description":"What makes this place exciting at night",
   "coordinates":{
      "lat":0,
      "lng":0
   },
   "bestTime":"Best time of night",
   "duration":"Typical time spent",
   "cost":"Average spending",
   "activities":[
      "Live music",
      "Dance floor",
      "Cocktail experience"
   ],
   "special":"Unique nightlife feature",
   "tips":[
      "Dress code tip",
      "Reservation advice"
   ]
  }
 ]
}

Rules:
- Include bars, clubs, night markets
- imageQuery must represent nightlife
- JSON only
`;