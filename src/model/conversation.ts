import mongoose, { Model, Schema, model } from "mongoose";
import { IUser } from "./user";

interface IConversation {
  members: Array<any>;
  lastMessageAt: Date;
  time: string | null;
}

type Connected = Omit<IUser, "password"> & {
  connected: boolean;
};

interface FromTo {
  from: Connected;
  to: Connected;
}

type TModel = Model<IConversation, {}, FromTo>;

const schema = new Schema<IConversation, TModel, FromTo>(
  {
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
        unique: true,
      },
    ],
    lastMessageAt: { type: Date, default: null },
    time: { type: String, default: null },
  },
  {
    toJSON: {
      getters: true,
      virtuals: true,
    },
    toObject: {
      getters: true,
      virtuals: true,
    },
    timestamps: true,
  }
);
schema.virtual("messages", {
  ref: "message",
  localField: "_id",
  foreignField: "conversation",
  perDocumentLimit: 15,
  get: (m: Array<any>) => m.reverse(),
});

export const conversationSchema = schema;

const Conversation = model("conversation", schema);

export default Conversation;
