import { Router } from "express";
import {
  getAll,
  store,
} from "../../../../../controller/api/v1/user/messageController";
const route = Router()

route.post("/", store);
route.get("/", getAll);

export default route;
