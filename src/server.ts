import express, { Express, Request, Response, Errback } from "express";
import * as dotenv from "dotenv";
import { createServer } from "http";
import connectDb from "./database";
import cors from "cors";
import v1UserRoute from "./routes/api/v1/user";
import path from "path";
import { createSocketServer } from "./socket/server";
import mongoose from "mongoose";
import seeder from "./database/seeder";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

dotenv.config();

const port = process.env.PORT;
const hostName: any = "192.168.99.139";

const app: Express = express();
const server = createServer(app);
createSocketServer(server);

app.use((req, res, next) => {
  console.log(req.url);
  next();
});

// middleware
app.use(
  cors({
    origin: "http://192.168.99.139:3000",
  })
);
app.use(express.json());

app.get("/avatar/:id([1-5])", (req, res) => {
  const avatars = ["bear", "cat", "rabbit", "tiger", "bear", "cat", "rabbit"];
  return res.sendFile(
    path.join(__dirname, `public/avatar/${avatars[Number(req.params.id)]}.png`)
  );
});
app.use("/api/v1", v1UserRoute);
app.use((error: Errback, req: Request, res: Response) => {
  console.log(error);
  return res.status(500).json("error");
});

connectDb();

mongoose.connection.once("connected", () => {
  server.listen(port, hostName, () => {
    console.log(`⚡️[server]: Server is running at http://${hostName}:${port}`);
  });
});
