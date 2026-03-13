module.exports = (destination, title, description) => `
You are an adventure travel planner.

Create an adventure experience plan for:

Destination: ${destination}
Title: ${title}
Description: ${description}

Select 6 adventure spots or activities.

Return JSON:

{
 "destination":"${destination}",
 "theme":"adventure",
 "places":[
  {
   "name":"Adventure location",
   "description":"What makes this place exciting",
   "coordinates":{
      "lat":0,
      "lng":0
   },
   "bestTime":"Best season or time",
   "duration":"Typical experience time",
   "cost":"Estimated activity cost",
   "activities":[
      "Activity 1",
      "Activity 2"
   ],
   "special":"Unique adventure feature",
   "tips":[
      "Safety tip",
      "Best time tip"
   ]
  }
 ]
}

Rules:
- Include real adventure activities
- Example: trekking, water sports, paragliding
- imageQuery should represent the activity
- Coordinates must be accurate
- JSON only
`;