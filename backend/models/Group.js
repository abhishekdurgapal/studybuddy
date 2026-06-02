const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  subject: {
    type: String,
    required: true,
  },

  level: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    default: "beginner"
  },

  availability: [String],

  maxMembers: {
    type: Number,
    default: 10
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ]

}, { timestamps: true });

module.exports = mongoose.model("Group", groupSchema);