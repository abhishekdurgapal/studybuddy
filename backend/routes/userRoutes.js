const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const { getProfile, getMatches } = require("../controllers/userController");

// routes
router.get("/profile", authMiddleware, getProfile);
router.get("/matches", authMiddleware, getMatches);

module.exports = router;