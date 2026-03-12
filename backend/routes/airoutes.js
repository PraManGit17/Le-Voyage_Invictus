const express = require("express");
const router = express.Router();
const { generateTravelIdeas } = require("../controllers/aiController");

router.post("/travel-ideas", generateTravelIdeas);

module.exports = router;