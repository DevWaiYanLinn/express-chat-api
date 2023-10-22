import { Router } from "express";
import {
  messageByConversationId,
  getAll,
  conversationMessage,
} from "../../../../controller/api/v1/conversationController";
import { authenticated } from "../../../../middleware/authMiddleware";
const route = Router();

route.use(authenticated);
route.get("/", getAll);
route.get("/messages", conversationMessage);
route.get("/:id/messages", messageByConversationId);

export default route;
