import { Schema, model } from "mongoose";
const userSchema = new Schema(
  {
    members: [{ type: Schema.Types.ObjectId, ref: "user" }],
    lastMessage: { type: Schema.Types.ObjectId, ref: "message", default: null },
    lastMessageAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

const Conversation = model("conversation", userSchema);

export default Conversation;
