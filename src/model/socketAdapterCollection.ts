import mongoose from "mongoose";
import { Emitter } from "@socket.io/mongo-emitter";

const socketAdapterCollection = () => {
    return mongoose.connection.db.collection("socket.io-adapter-events")
};


export const eventEmitter = () => {
    return new Emitter(socketAdapterCollection());
}
export default socketAdapterCollection