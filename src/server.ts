import express, { Express, Request, Response } from "express";
import * as dotenv from "dotenv";
import { createServer } from "http";
import connectDb from "./database";
import cors from "cors";
import v1UserRoute from "./routes/api/v1/user";
import path from "path";
import { createSocketServer } from "./socket/server";
import mongoose from "mongoose";

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
app.use("/api/v1", v1UserRoute);

app.use((error) => {
  console.log(error);
});


connectDb()
mongoose.connection.once("connected", () => {
  server.listen(port, hostName, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
});

