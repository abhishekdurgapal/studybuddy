const { Server } = require("socket.io");
const Message = require("../models/Message");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // join group room
    socket.on("joinGroup", (groupId) => {
      socket.join(groupId);
      console.log("Joined group:", groupId);
    });

    // send message
    socket.on("sendMessage", async (data) => {
      try {
        const { groupId, senderId, text } = data;

        // save message in DB
        const message = await Message.create({
          groupId,
          sender: senderId,
          text
        });

        // emit to group
        io.to(groupId).emit("receiveMessage", message);

      } catch (error) {
        console.error(error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

module.exports = { initSocket };