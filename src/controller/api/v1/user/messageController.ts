import { Request, Response, NextFunction } from "express";
import Message from "../../../../model/message";
import { eventEmitter } from "../../../../model/socketAdapterCollection";
export const store = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { conversation, sender, receiver, content, messageAt } = req.body;
  try {
    const newMessage = new Message({
      conversation,
      sender,
      receiver,
      content,
      messageAt,
    });
    await newMessage.save();
    const emitter = eventEmitter();
    emitter.emit(`${conversation}`, newMessage);
    return res.status(200).json("true");
  } catch (error) {
    next(error);
  }
};

export const getAll = async () => {};
