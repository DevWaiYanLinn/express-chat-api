import { Request, Response, NextFunction } from "express";
import JsonWebToken from "../service/jwtService";
import User from "../model/user";

export const authenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || "";
    const decoded: any = await JsonWebToken.verify(token);
    const user = await User.findById(decoded._id)
      .select("-createdAt -updatedAt -password")
      .exec();
    if (!user) throw new Error("Token Error");
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
