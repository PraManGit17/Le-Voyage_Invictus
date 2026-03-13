const mongoose = require("mongoose");

const groupMemberSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, enum: ["organizer", "member"], default: "member" },
    poolContribution: { type: Number, default: 0 },
  },
  { _id: false },
);

const groupTripSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    destination: { type: String, default: "" },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    maxMembers: { type: Number, default: 6 },
    status: { type: String, default: "upcoming" },
    tags: [{ type: String }],
    guidelines: [{ type: String }],
    itineraryId: { type: String, default: "" },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [groupMemberSchema],
    budget: {
      total: { type: Number, default: 0 },
      spent: { type: Number, default: 0 },
      currency: { type: String, default: "₹" },
      poolRaised: { type: Number, default: 0 },
    },
    tripData: { type: mongoose.Schema.Types.Mixed, default: {} },
    generatedPlan: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

module.exports = mongoose.model("GroupTrip", groupTripSchema);
