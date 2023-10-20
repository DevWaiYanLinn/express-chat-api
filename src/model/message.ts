import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    conversation: {
      type: Schema.Types.ObjectId,
      ref: "conversation",
      required: true,
    },
    from: { type: Schema.Types.ObjectId, ref: "user", required: true },
    to: { type: Schema.Types.ObjectId, ref: "user", required: true },
    content: { type: String, reqired: true },
    messageAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

const Message = model("message", userSchema);

export default Message;
