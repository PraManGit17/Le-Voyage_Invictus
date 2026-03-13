// const { generateDiscoveries } = require("../services/travelAgent");

// const planTrip = async (req, res) => {
//   try {

//     const { states, cities, tripTypes } = req.body;

//     if (!states || !cities || !tripTypes) {
//       return res.status(400).json({
//         message: "states, cities and tripTypes required"
//       });
//     }

//     const discoveries = await generateDiscoveries({
//       states,
//       cities,
//       tripTypes
//     });

//     res.status(200).json({
//       success: true,
//       discoveries
//     });

//   } catch (error) {

//     console.error("Trip AI error:", error);

//     res.status(500).json({
//       message: "Failed to generate discovery plan",
//       error: error.message
//     });

//   }
// };

// module.exports = { planTrip };

const { generateTripData } = require("../agents/travelAgent");

const planTrip = async (req, res) => {
  try {

    const { states, cities, tripTypes } = req.body;

    if (!states || !cities || !tripTypes) {
      return res.status(400).json({
        message: "states, cities and tripTypes required"
      });
    }

    const discoveries = await generateTripData({
      mode: "discover",
      states,
      cities,
      tripTypes
    });

    res.status(200).json({
      success: true,
      discoveries
    });

  } catch (error) {

    console.error("Trip AI error:", error);

    res.status(500).json({
      message: "Failed to generate discovery plan",
      error: error.message
    });

  }
};

module.exports = { planTrip };