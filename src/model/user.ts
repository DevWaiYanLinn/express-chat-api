import { Schema, model } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  avatar: string;
  password: string;
  id: string;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, index: { unique: true } },
    avatar: { type: String, default: null },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

const User = model<IUser>("user", userSchema);

export default User;
