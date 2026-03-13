const mongoose = require("mongoose")

const savedPlaceSchema = new mongoose.Schema(
  {
    placeName: { type: String, required: true },
    description: { type: String },
    location: {
      lat: { type: Number },
      lng: { type: Number },
      address: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String }
    },
    category: { type: String },
    imageUrl: { type: String },
    sourceUrl: { type: String },
    sourcePlatform: {
      type: String,
      enum: ["youtube", "instagram", "web", "extension", "manual"]
    },
    bestTimeToVisit: { type: String },
    estimatedBudget: { type: String },
    highlights: [{ type: String }],
    aiSummary: { type: String },
    savedAt: { type: Date, default: Date.now }
  },
  { _id: true }
)

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    preferences: [
      {
        type: String
      }
    ],

    saved_destinations: [
      {
        type: String
      }
    ],

    savedPlaces: [savedPlaceSchema]
  },
  { timestamps: true }
)

module.exports = mongoose.model("User", userSchema)