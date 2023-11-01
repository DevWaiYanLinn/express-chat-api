import { Router } from "express";
import {
  messageByConversationId,
  getAll,
  conversationMessage,
} from "../../../../controller/api/v1/conversationController";
import { authenticated } from "../../../../middleware/authMiddleware";
import { conversationSchema } from "../../../../model/conversation";
const route = Router();

route.use(authenticated, (req, res, next) => {
  conversationSchema.virtual("from").get(function () {
    return this.members.find(
      (m) => m.id === req.user.id
    );
  });
  conversationSchema.virtual("to").get(function () {
    return this.members.find(
      (m) => m.id !== req.user.id
    );
  });
  next();
});
route.get("/", getAll);
route.get("/messages", conversationMessage);
route.get("/:id/messages", messageByConversationId);

export default route;
