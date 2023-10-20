import { createAdapter as mongoAdapter } from "@socket.io/mongo-adapter";
import { createAdapter as redisAdapter } from "@socket.io/redis-adapter";
import express, { Express, Request, Response, Errback } from "express";
import * as dotenv from "dotenv";
import { createServer } from "http";
import connectDb, { pubClient, subClient } from "./database";
import cors from "cors";
import v1UserRoute from "./routes/api/v1/user";
import path from "path";
import mongoose from "mongoose";
import { Server } from "socket.io";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "socket";
import socketAdapterCollection from "./model/socketAdapterCollection";
import { RedisSessionStore } from "./database/redis/redisSessionStore";
import { randomUUID } from "crypto";
import seeder from "./database/mongo/seeder";

dotenv.config();

const port = process.env.PORT;
const hostName: any = "192.168.99.139";

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

app.use(
  cors({
    origin: "http://192.168.99.139:3000",
  })
);
app.use(express.json());

app.get("/avatar/:id([1-5])", (req, res) => {
  const avatars = ["bear", "cat", "rabbit", "tiger", "bear", "cat", "rabbit"];
  res.sendFile(
    path.join(__dirname, `public/avatar/${avatars[Number(req.params.id)]}.png`)
  );
});

app.use("/api/v1", v1UserRoute);

app.use((error: Errback, req: Request, res: Response) => {
  res.status(500).json("error");
});

connectDb();

mongoose.connection.once("connected", async () => {
  try {
    await mongoose.connection.db
      .collection("socket.io-adapter-events")
      .createIndex(
        { createdAt: 1 },
        { expireAfterSeconds: 3600, background: true }
      );
  } catch (error) {
    console.log(error);
  }

  io.adapter(
    mongoAdapter(socketAdapterCollection(), {
      addCreatedAtField: true,
    })
  );

  io.adapter(redisAdapter(pubClient, subClient));
  pubClient.flushAll();
  server.listen(port, hostName, () => {
    console.log(`⚡️[server]: Server is running at http://${hostName}:${port}`);
  });
});

const sessionStore = new RedisSessionStore(pubClient as any);

io.use(async (socket, next) => {
  const { sessionId, userId } = socket.handshake.auth;

  if (sessionId) {
    const session = await sessionStore.findSession(sessionId);

    if (Object.keys(session).length) {
      socket.data = {
        sessionId,
        userId: session.userId,
      };

      return next();
    }
  }

  socket.data = {
    sessionId: randomUUID().toString(),
    userId: userId,
  };

  next();
});

io.on("connection", async (socket) => {
  await sessionStore.saveSession(socket.data.sessionId, {
    userId: socket.data.userId,
    connected: 1,
  });

  socket.emit("session", socket.data);

  socket.join(socket.data.userId);

  const users = await sessionStore.findAllSession();

  socket.emit("users", users);

  socket.on("disconnect", async () => {
    const allSocket = await io.in(socket.data.userId).fetchSockets();

    if (!allSocket.length) {
      await sessionStore.saveSession(socket.data.sessionId, {
        userId: socket.data.userId,
        connected: 0,
      });

      socket.broadcast.emit("user_disconnected", socket.data.userId);
    }
  });
});
