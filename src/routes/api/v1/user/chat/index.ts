import { Router } from "express";
import { getAll } from "../../../../../controller/api/v1/user/conversationController";
const route = Router()

route.get('/chats', getAll)

export default route