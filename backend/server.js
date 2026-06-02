const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { Server } = require("socket.io");
const Message = require("./models/Message");


dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

io.on("connection", (socket) => {

  socket.on("joinRoom", (groupId) => {
    socket.join(groupId);
  });

  socket.on("sendMessage", async (data) => {
    console.log("Received:", data); 
    const { groupId, message , senderName } = data;

    // SAVE MESSAGE
    await Message.create({
      groupId,
      message,
      senderName,
      
    });

    // SEND TO ROOM
    io.to(groupId).emit("receiveMessage", {
      message,
      senderName
     
    });
  });

});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/groups", require("./routes/groupRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});