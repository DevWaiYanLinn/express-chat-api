import { Request, Response, NextFunction } from "express";
import Message from "../../../../model/message";
import { eventEmitter } from "../../../../model/socketAdapterCollection";
import Conversation from "../../../../model/conversation";
export const store = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { conversation, from, to, content, messageAt } = req.body;
  try {
    const newMessage = new Message({
      conversation,
      from,
      to,
      content,
      messageAt,
    });
    await Conversation.findByIdAndUpdate(
      { _id: conversation },
      {
        lastMessage: newMessage._id,
        lastMessageAt: messageAt,
      }
    );
    await newMessage.save();
    const emitter = eventEmitter();
    emitter.emit(`${conversation}`, newMessage);
    res.status(200).json("true");
  } catch (error) {
    next(error);
  }
};

export const getAll = async () => {};
