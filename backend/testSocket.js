const io = require("socket.io-client");

const socket = io("http://localhost:5000");

// join group
socket.emit("joinGroup", "69d2bd684aaede9fcc6c2452");

// listen message
socket.on("receiveMessage", (msg) => {
  console.log("New Message:", msg);
});

// send message
setTimeout(() => {
  socket.emit("sendMessage", {
    groupId: "69d2bd684aaede9fcc6c2452",
    senderId: "69d2b62886c251930ef4a046",
    text: "Hello from test!"
  });
}, 2000);