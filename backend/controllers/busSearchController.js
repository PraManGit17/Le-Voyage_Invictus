const axios = require("axios");

const busSearchController = async (req, res) => {
  try {

    const { fromCity, toCity, departureTime } = req.body;

    const query = `
Find buses from ${fromCity} to ${toCity} in India around ${departureTime}.

Return STRICT JSON format only.

{
 "buses":[
  {
   "operator":"",
   "busType":"",
   "departureTime":"",
   "arrivalTime":"",
   "duration":"",
   "priceRange":""
  }
 ]
}

Rules:
- Suggest ONLY 3 buses
- Departure should be close to ${departureTime}
- Include common operators like RedBus, RSRTC, private Volvo etc
- Do not include explanations
`;

    const response = await axios.post(
      "https://api.tavily.com/search",
      {
        query,
        search_depth: "advanced",
        max_results: 5,
        include_answer: true
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.TAVILY_API_KEY_BUS}`,
          "Content-Type": "application/json"
        }
      }
    );

    const answer = response.data.answer || "";

    let parsed;

    try {
      parsed = JSON.parse(answer);
    } catch {
      parsed = { rawAnswer: answer };
    }

    res.json({
      route: `${fromCity} → ${toCity}`,
      requestedDeparture: departureTime,
      data: parsed
    });

  } catch (error) {

    console.error(error.response?.data || error.message);

    res.status(500).json({
      message: "Bus search failed",
      error: error.message
    });

  }
};

module.exports = { busSearchController };