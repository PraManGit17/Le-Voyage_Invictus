const express = require("express");
const router = express.Router();

const {
  testDB,
  getTopAttractions,
  getAverageBudget,
  getGroupAttractions,
  addUserInterest,
  getAllUserInterests
} = require("../controllers/travelController");


// Test MongoDB connection
router.get("/test-db", testDB);


// Get attractions based on interests
router.post("/attractions", getTopAttractions);


// Calculate average group budget
router.post("/average-budget", getAverageBudget);


// Get attractions for group interests
router.post("/group-attractions", getGroupAttractions);

router.post("/add-user-interest", addUserInterest);


// See all stored interests
router.get("/user-interests", getAllUserInterests);

module.exports = router;