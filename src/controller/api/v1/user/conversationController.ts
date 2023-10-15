import { Request, Response, NextFunction } from "express";
import Conversation from "../../../../model/conversation";
import Message from "../../../../model/message";
export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const limit = Number(req.query.limit || 15);
  const skip = Number(req.query.skip || 0);
  const conversations = await Conversation.find({
    members: {
      $in: [req.user._id],
    },
  })
    .populate(["members", "lastMessage"])
    .sort({ lastMessageAt: -1 })
    .skip(skip)
    .limit(limit)
    .allowDiskUse(true)
    .exec();
  res.status(200).json(conversations);
};

export const conversationMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const conversationId = req.params.conversationId;
  const limit = req.params.limit || 50;

  const conversation = await Conversation.findOne({ _id: conversationId })
    .populate("members")
    .exec();

  const messages = await Message.find({ conversation: conversationId })
    .sort({ messageAt: -1 })
    .limit(Number(limit))
    .exec();
  res.status(200).json({ conversation, messages });
};
