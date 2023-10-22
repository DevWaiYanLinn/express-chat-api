import { Schema, model } from "mongoose";
const conversationSchema = new Schema(
  {
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    lastMessageAt: { type: Date, default: null },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);
conversationSchema.virtual("messages", {
  ref: "message",
  localField: "_id",
  foreignField: "conversation",
  perDocumentLimit: 15,
});
const Conversation = model("conversation", conversationSchema);

export default Conversation;
