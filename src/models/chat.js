const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const chatSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectID,
      ref: "users",
      required: true,
    },
  ],
  messages: [messageSchema],
});

const chatModel = mongoose.model("Chat", chatSchema);
// const messageModel = mongoose.model("Message", messageSchema);
module.exports = chatModel;
