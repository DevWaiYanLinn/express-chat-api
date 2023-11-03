import { Model, Schema, model } from "mongoose";
import { UserInterface } from "./user";
import dayjs from '../lib/utility'

interface ConversationInterface {
  members: Array<any>;
  lastMessageAt: Date;
  time: string;
}

type member = Omit<UserInterface, "password"> & {
  connected: boolean;
};

interface MemberInterface {
  from: member;
  to: member;
}

type TypeModal = Model<ConversationInterface, {}, MemberInterface>;

const schema = new Schema<ConversationInterface, TypeModal, MemberInterface>(
  {
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    lastMessageAt: { type: Date, default: Date.now() },
    time: { type: String, default: dayjs(Date.now()).format('LT') },
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
  get: (m: Array<Omit<UserInterface, "password">>): Array<Omit<UserInterface, "password">> => m.reverse()
});

export const conversationSchema = schema;

const Conversation = model("conversation", schema);

export default Conversation;
