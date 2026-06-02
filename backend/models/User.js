const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  // StudyBuddy fields
  subjects: [String],          // e.g., ["DSA", "DBMS"]
  skillLevel: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
  },
  availability: [String],      // e.g., ["morning", "evening"]

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);