import mongoose from "mongoose";

export default async () => {
  await mongoose.connect(
    "mongodb://DESKTOP-OUSQB3M:27019/WN-CHAT?replicaSet=rs"
  );
};
