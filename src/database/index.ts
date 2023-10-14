import mongoose from "mongoose";

export default async (cb: CallableFunction) => {
  try {
    await mongoose.connect(
      "mongodb://DESKTOP-OUSQB3M:27019/WN-CHAT?replicaSet=rs"
    );
    cb();
  } catch (error) {
    console.log("Db connecting is failed");
    cb(error);
  }
};
