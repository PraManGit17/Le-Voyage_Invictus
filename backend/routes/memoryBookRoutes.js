const express = require("express")
const router = express.Router()
const { generateStory } = require("../controllers/memoryBookController")
const authMiddleware = require("../middleware/authMiddleware")

router.post("/generate-story", authMiddleware, generateStory)

module.exports = router
