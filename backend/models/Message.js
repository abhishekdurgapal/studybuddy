const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  groupId: {
    type: String,
    required: true
  },
  senderId: {
    type: String
  },
  senderName: {
  type: String
},
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Message", messageSchema);