const axios = require("axios");

const searchRestaurants = async (req, res) => {

  try {

    const { query, city } = req.body;

    if (!query || !city) {
      return res.status(400).json({
        message: "query and city are required"
      });
    }

    const searchQuery = `${query} in ${city}`;

    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/textsearch/json",
      {
        params: {
          query: searchQuery,
          key: process.env.GOOGLE_PLACES_API_KEY
        }
      }
    );

    const places = response.data.results.slice(0,5).map(place => ({
      name: place.name,
      address: place.formatted_address,
      rating: place.rating,
      location: place.geometry.location,
      priceLevel: place.price_level
    }));

    res.json({
      search: searchQuery,
      restaurants: places
    });

  } catch (error) {

    console.error(error.response?.data || error.message);

    res.status(500).json({
      message: "Failed to fetch restaurants",
      error: error.message
    });

  }

};

module.exports = { searchRestaurants };