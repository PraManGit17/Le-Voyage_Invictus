const User = require("../models/User")
const {
  analyzePlaceFromUrl,
  analyzePlaceFromText,
} = require("../services/placeAnalysisService")

// POST /api/places/analyze — Analyze a URL or text using Gemini + LangGraph
exports.analyzePlace = async (req, res) => {
  try {
    const { url, text, caption } = req.body

    if (!url && !text) {
      return res.status(400).json({ message: "Provide a URL or text to analyze" })
    }

    let result
    if (url) {
      result = await analyzePlaceFromUrl(url, caption || "")
    } else {
      result = await analyzePlaceFromText(text)
    }

    res.json({ place: result })
  } catch (error) {
    console.error("Analyze error:", error.message)
    const is429 = error.message?.includes("429") || error.message?.includes("rate-limited") || error.message?.includes("quota")
    const status = is429 ? 429 : 500
    const message = is429
      ? "Gemini API quota exceeded. Please wait 1-2 minutes and try again."
      : error.message || "Analysis failed"
    res.status(status).json({ message })
  }
}

// POST /api/places/save — Save an analyzed place to user's account
exports.savePlace = async (req, res) => {
  try {
    const userId = req.userId
    const placeData = req.body

    if (!placeData.placeName) {
      return res.status(400).json({ message: "Place name is required" })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Check for duplicate by placeName + sourceUrl
    const isDuplicate = user.savedPlaces.some(
      (p) =>
        p.placeName === placeData.placeName &&
        p.sourceUrl === (placeData.sourceUrl || "")
    )

    if (isDuplicate) {
      return res.status(409).json({ message: "Place already saved" })
    }

    user.savedPlaces.push({
      placeName: placeData.placeName,
      description: placeData.description || "",
      location: placeData.location || {},
      category: placeData.category || "other",
      imageUrl: placeData.imageUrl || "",
      sourceUrl: placeData.sourceUrl || "",
      sourcePlatform: placeData.sourcePlatform || "manual",
      bestTimeToVisit: placeData.bestTimeToVisit || "",
      estimatedBudget: placeData.estimatedBudget || "",
      highlights: placeData.highlights || [],
      aiSummary: placeData.aiSummary || "",
    })

    await user.save()

    const savedPlace = user.savedPlaces[user.savedPlaces.length - 1]
    res.status(201).json({ place: savedPlace })
  } catch (error) {
    console.error("Save error:", error.message)
    res.status(500).json({ message: "Failed to save place" })
  }
}

// GET /api/places/saved — Get all saved places for logged-in user
exports.getSavedPlaces = async (req, res) => {
  try {
    const userId = req.userId

    const user = await User.findById(userId).select("savedPlaces")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Sort by savedAt descending
    const places = [...user.savedPlaces].sort(
      (a, b) => new Date(b.savedAt) - new Date(a.savedAt)
    )

    res.json({ places })
  } catch (error) {
    console.error("Fetch saved places error:", error.message)
    res.status(500).json({ message: "Failed to fetch saved places" })
  }
}

// DELETE /api/places/saved/:placeId — Remove a saved place
exports.deleteSavedPlace = async (req, res) => {
  try {
    const userId = req.userId
    const { placeId } = req.params

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const placeIndex = user.savedPlaces.findIndex(
      (p) => p._id.toString() === placeId
    )

    if (placeIndex === -1) {
      return res.status(404).json({ message: "Place not found" })
    }

    user.savedPlaces.splice(placeIndex, 1)
    await user.save()

    res.json({ message: "Place removed" })
  } catch (error) {
    console.error("Delete error:", error.message)
    res.status(500).json({ message: "Failed to delete place" })
  }
}
