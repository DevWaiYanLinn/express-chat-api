import { Router } from "express";

const route = Router();

route.get("/email-confirmation", (req, res) => {
  res.status(200).write("aaa");
});

export default route;
