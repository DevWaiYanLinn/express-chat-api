import { Router } from "express";
import { conversationMessages, getAll } from "../../../../../controller/api/v1/user/conversationController";
const route = Router();

route.get("/", getAll);
route.get("/:conversationId/messages", conversationMessages)

export default route;
