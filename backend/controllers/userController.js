const User = require("../models/User");

// GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getMatches = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    // find matching users
    const matches = await User.find({
      _id: { $ne: currentUser._id }, // exclude self

      subjects: { $in: currentUser.subjects },
      availability: { $in: currentUser.availability },

      // optional: filter skill level
      skillLevel: { $ne: currentUser.skillLevel } // different level preferred
    }).select("-password");

    res.json(matches);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};