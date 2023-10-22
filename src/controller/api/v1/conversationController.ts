import { Request, Response, NextFunction } from "express";
import Conversation from "../../../model/conversation";
import Message from "../../../model/message";
export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const limit = Number(req.query.limit || 15);
  const skip = Number(req.query.skip || 0);
  try {
    const conversations = await Conversation.find({
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
          path: "messages",
          options: {
            sort: { messageAt: -1 },
          },
        },
      ])
      .exec();

    const mapConversations = conversations.map((c) => {
      const conversation = c.toObject();
      const index = conversation.members.findIndex(
        (m) => m._id.toString() !== user._id
      );
      return {
        ...conversation,
        from: conversation.members[1 - index],
        to: conversation.members[index],
      };
    });
    res.status(200).json(mapConversations);
  } catch (error) {
    next(error);
  }
};

export const messageByConversationId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const conversationId = req.params.id;
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

export const conversationMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const limit = Number(req.query.limit || 15);
  const skip = Number(req.query.skip || 0);
  try {
    const conversations = await Conversation.find({
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
          path: "messages",
          options: {
            sort: { messageAt: -1 },
          },
        },
      ])
      .exec();

    const mapConversations = conversations.map((c) => {
      const conversation = c.toObject();
      const index = conversation.members.findIndex(
        (m) => m._id.toString() !== user._id
      );
      return {
        ...conversation,
        from: conversation.members[1 - index],
        to: conversation.members[index],
      };
    });
    res.status(200).json(mapConversations);
  } catch (error) {
    next(error);
  }
};
