const mongoose = require("mongoose")

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
    //hi
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
    ]
  },
  { timestamps: true }
)

module.exports = mongoose.model("User", userSchema)