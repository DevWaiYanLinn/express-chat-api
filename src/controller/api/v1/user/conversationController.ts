import { Request, Response, NextFunction } from "express";
import Conversation from "../../../../model/conversation";
import Message from "../../../../model/message";
export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('reeee')
  const conversations = await Conversation.aggregate([
    {
      $lookup: {
        from: "users", // The name of the "users" collection
        localField: "members",
        foreignField: "_id",
        as: "members",
      },
    },
    {
      $lookup: {
        from: "messages",
        localField: "_id",
        foreignField: "conversation",
        as: "messages",
      },
    },
    {
      $unwind: {
        path: "$messages",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $sort: { "messages.messageAt": -1 },
    },
    {
      $group: {
        _id: "$_id",
        lastMessage: { $first: "$messages" },
        members: { $first: "$members" },
      },
    },
  ]);
  return res.status(200).json(conversations);
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
  return res.status(200).json({ conversation, messages });
};
