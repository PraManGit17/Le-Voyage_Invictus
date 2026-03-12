const { generateTripData } = require("../services/travelAgent");

const generateFoodOptions = async (req, res) => {

  try {

    const { states, cities, discoveries } = req.body;

    const foodData = await generateTripData({
      mode: "food",
      states,
      cities,
      places: discoveries
    });

    res.json({
      success: true,
      food: foodData
    });

  } catch (error) {

    console.error("Food AI Error:", error);

    res.status(500).json({
      message: "Failed to generate food options"
    });

  }

};

module.exports = { generateFoodOptions };