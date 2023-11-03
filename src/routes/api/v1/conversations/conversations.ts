import { Router } from "express";
import {
  messageByConversationId,
  getAll,
  conversationMessage,
  store,
} from "../../../../controller/api/v1/conversationController";
import { authenticated } from "../../../../middleware/authMiddleware";
import { conversationSchema } from "../../../../model/conversation";
const route = Router();

route.use(authenticated);
route.get("/", getAll);
route.get("/messages", conversationMessage);
route.get("/", store)
route.get("/:id/messages", messageByConversationId);

export default route;
