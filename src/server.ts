import express, { Express, Request, Response } from "express";
import socketCb from "./socket";
import * as dotenv from "dotenv";
import { Server } from "socket.io";
import { createServer } from "http";
import {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
} from "socket";
import connectDb from "./database";
import cors from "cors";
import v1UserRoute from "./routes/api/v1/user";
import mongoose from "mongoose";
import { createAdapter } from "@socket.io/mongo-adapter";
import socketAdapterCollection, {
  eventEmitter,
} from "./model/socketAdapterCollection";
import path from "path";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

dotenv.config();

const port = process.env.PORT;
const app: Express = express();
const server = createServer(app);

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

// middleware
app.use(
  cors({
    origin: "http://192.168.99.139:3000",
  })
);
app.use(express.json());

app.use("/avatar/:url([1-5])", (req, res) => {
  return res.sendFile(path.join(__dirname, "public/avatar/tiger.png"));
});
// router
app.use("/api/v1", v1UserRoute);

// error
app.use((error, req, res) => {
  console.log(error);
});

//db connect
connectDb(async (err: any) => {
  if (!err) {
    // try {
    //   // seeder()
    //   const mongoCollection = await mongoose.connection.db.createCollection(
    //     "socket.io-adapter-events",
    //     {
    //       capped: true,
    //       size: 1e6
    //     }
    //   );
    //   await mongoCollection.createIndex(
    //     { createdAt: 1 },
    //     { expireAfterSeconds: 3600, background: true }
    //   );
    // } catch (error) {
    //   ("b");
    // }

    io.adapter(
      createAdapter(socketAdapterCollection(), {
        addCreatedAtField: true,
      })
    );
    const hostName: any = "192.168.99.139";
    server.listen(port, hostName, () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
  }
});
const activeUsers = new Map();
io.on("connection", (socket) => {
  socket.join(socket.handshake.query.conversationId as string);

  socket.on("disconnecting", () => {
    console.log("user is disconnected b");
  });
});
