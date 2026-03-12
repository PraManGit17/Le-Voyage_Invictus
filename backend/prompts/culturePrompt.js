module.exports = (destination, title, description) => `
You are a cultural tourism expert.

Create a cultural exploration plan for:

Destination: ${destination}
Title: ${title}
Description: ${description}

Select 6 culturally important locations.

Return JSON:

{
 "destination":"${destination}",
 "theme":"culture",
 "places":[
  {
   "name":"Cultural landmark",
   "description":"Cultural significance of the place",
   "coordinates":{
      "lat":0,
      "lng":0
   },
   "bestTime":"Best visiting time",
   "duration":"Typical visit duration",
   "cost":"Entry fee",
   "activities":[
      "Cultural exploration",
      "Art appreciation",
      "Local interaction"
   ],
   "special":"Unique cultural element",
   "tips":[
      "Etiquette tip",
      "Travel tip"
   ]
  }
 ]
}

Rules:
- Include museums, art districts, cultural landmarks
- imageQuery must represent the place
- JSON only
`;