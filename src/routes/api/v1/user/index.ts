import { Router } from "express";
import authRoute from "./auth";
import messageRoute from "./messages";
import conversationRoute from "./conversations";

const route = Router();

route.use("/auth", authRoute);
route.use("/messages", messageRoute);
route.use("/conversations", conversationRoute);

export default route;
