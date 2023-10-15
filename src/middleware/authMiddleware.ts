import { Request, Response, NextFunction } from "express";
import JsonWebToken from "../service/jwt";

export const authenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new Error("Token Error");
    req.user = await JsonWebToken.verify(token);
    next();
  } catch (error) {
    res.json(401).json({ message: "Access Token Expire" });
  }
};
