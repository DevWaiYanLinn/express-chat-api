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
    return req.user;
  });
  conversationSchema.virtual("to").get(function () {
    return this.members.find(
      (m) => m._id.toString() !== req.user._id.toString()
    );
  });
  next();
});
route.get("/", getAll);
route.get("/messages", conversationMessage);
route.get("/:id/messages", messageByConversationId);

export default route;
