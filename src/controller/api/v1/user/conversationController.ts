import { Request, Response, NextFunction } from "express";
import Conversation from "../../../../model/conversation";
import Message from "../../../../model/message";
export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const limit = Number(req.query.limit || 15);
  const skip = Number(req.query.skip || 0);
  try {
    let conversations = await Conversation.find({
      members: {
        $in: user._id,
      },
    })
      .sort({ lastMessageAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate([
        {
          path: "members",
          select: "-password -createdAt -updatedAt",
        },
        {
          path: "lastMessage",
          options: {
            sort: { messageAt: -1 },
          },
        },
      ])
      .exec();
    res.status(200).json(conversations)
  } catch (error) {
    next(error);
  }
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
