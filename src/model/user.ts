import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String, default:null },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const User = model("user", userSchema);

export default User;
