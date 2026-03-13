const express = require("express");
const router = express.Router();
const { generateTravelIdeas } = require("../controllers/aiController");
const {generateDiscoveryPlan } = require("../controllers/discoveryPlanController");

router.post("/travel-ideas", generateTravelIdeas);
router.post("/discovery-plan", generateDiscoveryPlan);

module.exports = router;