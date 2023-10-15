import { Router } from "express";
import {
  conversationMessages,
  getAll,
} from "../../../../../controller/api/v1/user/conversationController";
import { authenticated } from "../../../../../middleware/authMiddleware";
const route = Router();

route.use(authenticated);
route.get("/", getAll); 
route.get("/:conversationId/messages", conversationMessages);

export default route;
