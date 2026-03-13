const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    durationDays: { type: Number, default: 1 },
    notes: { type: String, default: "" },
    destinations: { type: mongoose.Schema.Types.Mixed, default: [] },
    itinerary: { type: mongoose.Schema.Types.Mixed, default: [] },
    budget: {
      total: { type: Number, default: 0 },
      spent: { type: Number, default: 0 },
      estimated: { type: Number, default: 0 },
    },
    collaborators: { type: mongoose.Schema.Types.Mixed, default: [] },
    recommendedItineraryId: { type: String, default: "" },
    recommendedItineraryName: { type: String, default: "" },
    generatedPlan: { type: mongoose.Schema.Types.Mixed, default: {} },
    groupName: { type: String, default: "" },
    groupId: { type: String, default: "" },
    memoryBook: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Trip", tripSchema);