import { Schema, model } from "mongoose";

export interface UserInterface {
  id: string;
  name: string;
  email: string;
  avatar: string;
  password: string;
  verified: boolean;
}

const userSchema = new Schema<UserInterface>(
  {
    name: { type: String, required: true, index: true },
    email: { type: String, required: true, index: { unique: true } },
    avatar: { type: String, default: null },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
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

const User = model<UserInterface>("user", userSchema);

export default User;
