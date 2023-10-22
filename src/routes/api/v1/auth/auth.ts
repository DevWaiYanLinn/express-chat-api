import { Router } from "express";
import {
  login,
  refresh,
  register,
} from "../../../../controller/api/v1/authController";
import validator from "../../../../validator/validator";
import userValidator from "../../../../validator/userValidator";
import authValidator from "../../../../validator/authValidator";
const route = Router();

route.post("/login", validator(authValidator), login);
route.post("/register", validator(userValidator), register);
route.post("/refresh-tokens", refresh);

export default route;
