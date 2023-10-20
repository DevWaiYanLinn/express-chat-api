import mongoose from "mongoose";
import { createClient } from "redis";
export const pubClient = createClient({ url: "redis://localhost:6379" });
export const subClient = pubClient.duplicate();

export default async () => {
  try {
    await pubClient.connect();
    await subClient.connect();
    await mongoose.connect(
      "mongodb://DESKTOP-OUSQB3M:27019/WN-CHAT?replicaSet=rs"
    );
  } catch (error) {
    console.log(error);
  }
};
