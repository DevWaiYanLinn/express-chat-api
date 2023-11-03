import { Request, Response, NextFunction } from "express";
import User, { UserInterface } from "../../../model/user";
import JsonWebToken from "../../../service/jwtService";
import Hash from "../../../service/hashService";
import { emailQueue } from "../../../service/queueService";
import { CONFIRM_EMAIL } from "../../../config/config";
import AppError from "../../../exception/appError";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password }: { email: string; password: string } = req.body;
  try {
    const user = await User.findOne({ email }).exec();
    if (!user || !(await Hash.compare(password, user.password))) {
      return res.status(400).json({ message: "Not found" });
    }

    if (!user.verified) {
      throw new AppError('Email Verify error', 400, 'Your email address needs to be confirmed before you can access your account.')
    }
    const { password: pwd, ...userData } = user.toObject();
    const jwt = new JsonWebToken(userData);
    const { accessToken, accessTokenExpires } = jwt.createAccessToken();
    const refreshToken = jwt.createRefreshToken();
    res.status(200).json({
      user: userData,
      accessToken,
      refreshToken,
      accessTokenExpires,
    });
  } catch (error) {
    next(error);
  }
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, avatar } = req.body;
    const user = new User({ name, email, password, avatar });
    await user.save();
    emailQueue.add("email", {
      to: email,
      type: CONFIRM_EMAIL,
    });
    res.status(200).json({ message: "success" });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const decoded: UserInterface = await JsonWebToken.verify(req.body.refreshToken);
    const user = await User.findById(decoded.id).select("-password").exec();
    if (!user) {
      throw new AppError("Refresh Token Error", 400, "Invalid Token");
    }
    const userData = user.toObject();
    const jwt = new JsonWebToken(userData);
    const { accessToken, accessTokenExpires } = jwt.createAccessToken();

    res.status(200).json({
      accessToken,
      user: userData,
      accessTokenExpires,
    });
  } catch (error) {
    next(error);
  }
};
