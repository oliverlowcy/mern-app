const asyncHandler = require("express-async-handler");
const Message = require('../models/messageModel')
const User = require('../models/userModel')
const Chat = require('../models/chatModel')

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  console.log("CHAT!!!",chatId);
  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId._id,
  };

  try {
    var message = await Message.create(newMessage);

    message = await (
      await message.populate("sender")
    ).populate({
      path: "chat",
      model: "Chat",
      populate: { path: "users", model: "User"},
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});


const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = {sendMessage,allMessages}