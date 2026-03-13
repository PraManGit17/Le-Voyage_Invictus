const express = require("express");
const router = express.Router();

const { createItinerary } = require("../controllers/itineraryController");

router.post("/generate",createItinerary);

module.exports = router;