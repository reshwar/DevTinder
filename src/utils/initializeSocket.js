const socket = require("socket.io");
const jwt = require("jsonwebtoken");
const chatModel = require("../models/chat");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });
  io.on("connection", (socket) => {
    const tokenfromUI = socket.handshake.auth.token;
    const userIDFromRequest = socket.handshake.auth.userId;
    const decoded = jwt.verify(tokenfromUI, "devqwer"); // Replace 'devqwer' with your secret key
    // console.log("userIDFromRequest ", userIDFromRequest);
    try {
      if (!tokenfromUI || decoded._id !== userIDFromRequest) {
        console.log("No token provided");
        socket.emit("error", "Authentication token is missing");
        return socket.disconnect();
      }
    } catch (error) {
      console.log("Invalid token", error.message);
      socket.emit("error", "Invalid or expired token");
      return socket.disconnect();
    }

    //handle socket events here
    socket.on("joinChat", ({ firstname, userId, targetUserId }) => {
      const roomId = [userId, targetUserId].sort().join("-");
      console.log(`${firstname} with id ${roomId}`);
      socket.join(roomId);
    });
    socket.on(
      "sendMessage",
      async ({ firstname, lastname, userId, targetUserId, message }) => {
        try {
          let chat = await chatModel.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new chatModel({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({ senderId: userId, text: message });

          await chat.save();

          const roomId = [userId, targetUserId].sort().join("-");
          io.to(roomId).emit("receiveMessage", {
            firstname,
            lastname,
            message,
          });
          console.log(
            `Message from ${firstname} ${lastname} to room ${roomId}: ${message}`
          );
        } catch (error) {
          console.log("error", error.message);
        }
      }
    );
    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
