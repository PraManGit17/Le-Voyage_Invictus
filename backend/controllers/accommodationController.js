const axios = require("axios");

const searchAccommodation = async (req, res) => {
  try {

    const { place, city, type } = req.body;

    if (!place || !city) {
      return res.status(400).json({
        message: "place and city are required"
      });
    }

    const searchQuery = `${type || "hotels"} near ${place} ${city}`;

    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/textsearch/json",
      {
        params: {
          query: searchQuery,
          key: process.env.GOOGLE_PLACES_API_KEY
        }
      }
    );

    const hotels = response.data.results.slice(0, 5).map((place) => ({
      name: place.name,
      address: place.formatted_address,
      rating: place.rating,
      totalRatings: place.user_ratings_total,
      priceLevel: place.price_level,
      location: place.geometry.location
    }));

    res.json({
      search: searchQuery,
      accommodations: hotels
    });

  } catch (error) {

    console.error(error.response?.data || error.message);

    res.status(500).json({
      message: "Failed to fetch accommodation",
      error: error.message
    });

  }
};

module.exports = { searchAccommodation };