import { RedisSessionStore } from "./../../../database/redis/redisSessionStore";
import { Request, Response, NextFunction } from "express";
import Conversation from "../../../model/conversation";
import Message from "../../../model/message";
import { pubClient } from "../../../database/database";
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
      members: user._id,
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
    res.status(200).json(conversations);
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
    const sessionStore = new RedisSessionStore(pubClient as any);

    const conversations = await Conversation.find({
      members: user._id,
    })
      .select("-createdAt -updatedAt")
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
          select: "-createdAt -updatedAt",
          options: {
            sort: { messageAt: -1 },
          },
        },
      ])
      .transform(async (res) => {
        return await Promise.all(
          res.map(async (c) => {
            c = c.toObject();
            c.from.connected = true;
            const session = await sessionStore.findSession(c.to.id);
            c.to.connected = !!session?.connected;
            return c;
          })
        );
      })
      .exec();
    res.status(200).json(conversations);
  } catch (error) {
    next(error);
  }
};
