module.exports = (destination, title, description) => `
You are a nature travel specialist.

Create a nature exploration plan for:

Destination: ${destination}
Title: ${title}
Description: ${description}

Select 6 scenic natural places.

Return JSON:

{
 "destination":"${destination}",
 "theme":"nature",
 "places":[
  {
   "name":"Natural attraction",
   "description":"Scenic natural experience",
   "coordinates":{
      "lat":0,
      "lng":0
   },
   "bestTime":"Best season or time",
   "duration":"Average visiting duration",
   "cost":"Entry fee or Free",
   "activities":[
      "Nature walk",
      "Photography",
      "Wildlife spotting"
   ],
   "special":"What makes this place unique",
   "tips":[
      "Best viewpoint",
      "Travel tip"
   ]
  }
 ]
}

Rules:
- Include scenic natural spots
- Example: lakes, parks, viewpoints
- imageQuery must represent the place
- JSON only
`;