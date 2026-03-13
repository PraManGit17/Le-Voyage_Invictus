const express = require("express")
const router = express.Router()
const authMiddleware = require("../middleware/authMiddleware")

const {
  analyzePlace,
  savePlace,
  getSavedPlaces,
  deleteSavedPlace,
} = require("../controllers/placesController")

// Public — analyze a URL/text (extension doesn't need auth for analysis)
router.post("/analyze", analyzePlace)

// Protected — save/read/delete places (needs logged-in user)
router.post("/save", authMiddleware, savePlace)
router.get("/saved", authMiddleware, getSavedPlaces)
router.delete("/saved/:placeId", authMiddleware, deleteSavedPlace)

module.exports = router
