import mongoose from "mongoose";
import { createClient } from "redis";
import config from "../config/config";
export const pubClient = createClient({ url: "redis://localhost:6379" });
export const subClient = pubClient.duplicate();

export default async () => {
  try {
    await pubClient.connect();
    await subClient.connect();
    await mongoose.connect(config.mongodb.url());
  } catch (error) {
    console.log(error);
  }
};
