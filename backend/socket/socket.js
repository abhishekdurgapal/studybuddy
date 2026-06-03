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

    // JOIN ROOM
    socket.on("joinRoom", (groupId) => {
      socket.join(groupId);
      console.log("Joined room:", groupId);
    });

    // SEND MESSAGE
    socket.on("sendMessage", async (data) => {
      try {

        const {
          groupId,
          senderName,
          message
        } = data;

        // SAVE TO DATABASE
        const savedMessage =
          await Message.create({
            groupId,
            senderName,
            message
          });

        // SEND TO ROOM
        io.to(groupId).emit(
          "receiveMessage",
          savedMessage
        );

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
