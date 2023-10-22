import { Router } from "express";
import authRoute from "./auth/auth";
import messageRoute from "./messages/messages";
import conversationRoute from "./conversations/conversations";

const route = Router();

route.use("/auth", authRoute);
route.use("/messages", messageRoute);
route.use("/conversations", conversationRoute);

export default route;
