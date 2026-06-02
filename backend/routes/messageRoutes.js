const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

router.get("/:groupId", async (req, res) => {
  const messages = await Message.find({ groupId: req.params.groupId });
  res.json(messages);
});

module.exports = router;