const express = require("express");
const { userAuth } = require("../middleware/auth");
const chatModel = require("../models/chat");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  try {
    const targetUserId = req.params.targetUserId;
    const userId = req.user._id;

    let chat = await chatModel
      .findOne({
        participants: { $all: [userId, targetUserId] },
      })
      .populate({
        path: "messages.senderId",
        select: "firstname lastname",
      });

    if (!chat) {
      chat = new chatModel({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    }

    res.json(chat);
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = chatRouter;
