import { createAdapter as mongoAdapter } from "@socket.io/mongo-adapter";
import { createAdapter as redisAdapter } from "@socket.io/redis-adapter";
import express, { Express, Request, Response, Errback } from "express";
import * as dotenv from "dotenv";
import { createServer } from "http";
import connectDb, { pubClient, subClient } from "./database/database";
import cors from "cors";
import v1UserRoute from "./routes/api/v1/route";
import emailRoute from "./routes/page/email";
import path from "path";
import mongoose from "mongoose";
import { Server } from "socket.io";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "socket";
import { RedisSessionStore } from "./database/redis/redisSessionStore";
import Conversation from "./model/conversation";
import Message from "./model/message";
import dayjs from "./lib/utility";
import AppError from "./exception/appError";
import JsonWebToken from "./service/jwtService";
import { IUser } from "./model/user";
dotenv.config();

const port = process.env.APP_PORT;
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

app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`Request to ${req.originalUrl} took ${duration}ms`);
  });
  next();
});

app.use(express.json());

app.get("/avatar/:id([1-5])", (req, res) => {
  const avatars = ["bear", "cat", "rabbit", "tiger", "bear", "cat", "rabbit"];
  res.sendFile(
    path.join(__dirname, `public/avatar/${avatars[Number(req.params.id)]}.png`)
  );
});

app.use("/api/v1", v1UserRoute);
app.use(emailRoute);

app.use((error: any, req: Request, res: Response) => {
  const httpCode = error.httpCode || 500;
  const stack = error.statck || "server error";
  res.status(httpCode).json(stack);
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
    mongoAdapter(
      mongoose.connection.db.collection("socket.io-adapter-events"),
      {
        addCreatedAtField: true,
      }
    )
  );

  io.adapter(redisAdapter(pubClient, subClient));

  if (process.env.APP_ENV === "development") {
    pubClient.flushAll();
  }
  server.listen(port, hostName, () => {
    console.log(`⚡️[server]: Server is running at http://${hostName}:${port}`);
  });
});

const sessionStore = new RedisSessionStore(pubClient as any);

io.use(async (socket, next) => {
  const { token } = socket.handshake.auth;
  try {
    const user: IUser = await JsonWebToken.verify(token);
    socket.data = {
      userId: user.id,
    };
    await sessionStore.saveSession(socket.data.userId, {
      userId: socket.data.userId,
      connected: 1,
    });
    next();
  } catch {
    next(new AppError("Token Error", 400, "Authentication Failed"));
  }
});

io.on("connection", async (socket) => {
  socket.join(socket.data.userId);

  socket.on(
    "send_message",
    async ({ conversation, from, to, content, messageAt }) => {
      const newMessage = new Message({
        conversation,
        from,
        to,
        content,
        messageAt,
      });
      await newMessage.save();
      await Conversation.findOneAndUpdate(
        { _id: conversation },
        {
          lastMessageAt: messageAt,
          time: dayjs(messageAt).format("LT"),
        }
      ).exec();

      io.to(from).to(to).emit("send_message", {
        _id: newMessage.id,
        conversation,
        from,
        to,
        content,
        messageAt,
      });
    }
  );

  socket.on("disconnect", async () => {
    const allSocket = await io.in(socket.data.userId).fetchSockets();
    if (allSocket.length === 0) {
      await sessionStore.saveSession(socket.data.userId, {
        userId: socket.data.userId,
        connected: 0,
      });
      socket.broadcast.emit("user_disconnect", socket.data.userId);
    }
  });
});
