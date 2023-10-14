import { createAdapter } from "@socket.io/mongo-adapter";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "socket";
import { Server } from "socket.io";
import socketAdapterCollection from "../model/socketAdapterCollection";
import mongoose, { mongo } from "mongoose";

export const createSocketServer = (server: any) => {
  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(server, {
    cors: {
      origin: "http://192.168.99.139:3000",
    },
  });

  mongoose.connection.once("connected", () => {
    io.adapter(
      createAdapter(socketAdapterCollection(), {
        addCreatedAtField: true,
      })
    );
  });

  io.on("connection", (socket) => {
    socket.join(socket.handshake.query.conversationId as string);
    socket.on("disconnecting", () => {
      console.log("user is disconnected b");
    });
  });
};
