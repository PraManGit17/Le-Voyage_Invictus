const express = require("express");
const { planTrip } = require("../controllers/planTripController");
const { generateFoodOptions } = require("../controllers/foodController");

const router = express.Router();

router.post("/discover", planTrip);
router.post("/food", generateFoodOptions);

module.exports = router;