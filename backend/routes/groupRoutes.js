const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  createGroup,
  joinGroup,
  getGroups,
  getRecommendedGroups,
  getMyGroups,
  deleteGroup
} = require("../controllers/groupController");

// routes
router.post("/create", authMiddleware, createGroup);
router.post("/join/:id", authMiddleware, joinGroup);
router.get("/", authMiddleware, getGroups);
router.get("/recommended", authMiddleware, getRecommendedGroups);
router.get("/mygroups",authMiddleware,getMyGroups);
router.delete("/delete/:id",authMiddleware,deleteGroup);
module.exports = router;