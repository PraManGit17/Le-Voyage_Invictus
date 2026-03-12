const mongoose = require("mongoose");

const userInterestSchema = new mongoose.Schema({
  userId: String,
  city: String,
  interests: [String],
  budget: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("UserInterest", userInterestSchema);