import { Schema, model } from "mongoose";
const conversationSchema = new Schema(
  {
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
      transform: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

conversationSchema.virtual("lastMessage", {
  ref: "message",
  localField: "_id",
  foreignField: "conversation",
  limit: 1,
  justOne: true,
});

const Conversation = model("conversation", conversationSchema);

export default Conversation;
