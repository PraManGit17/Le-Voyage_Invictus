const axios = require("axios");

const trainSearchController = async (req, res) => {
  try {

    const { fromCity, toCity } = req.body;

    const query = `
Find trains from ${fromCity} to ${toCity} in India.

Return STRICT JSON format only.

{
 "trains":[
  {
   "trainName":"",
   "trainNumber":"",
   "departureTime":"",
   "arrivalTime":"",
   "duration":"",
   "priceRange":""
  }
 ]
}

Return ONLY top 3 trains.
`;

    const response = await axios.post(
      "https://api.tavily.com/search",
      {
        query: query,
        search_depth: "advanced",
        max_results: 5,
        include_answer: true
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.TAVILY_API_KEY_TRAIN}`,
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
      data: parsed
    });

  } catch (error) {

    console.error(error.response?.data || error.message);

    res.status(500).json({
      message: "Tavily search failed",
      error: error.message
    });

  }
};

module.exports = { trainSearchController };