import { Request, Response, NextFunction } from "express";
import User from "../../../model/user";
import JsonWebToken from "../../../service/jwtService";
import Hash from "../../../service/hashService";
import { emailQueue } from "../../../service/queueService";
import ConfirmationMail from "../../../mail/confirmationMail";

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
      return res
        .status(200)
        .json({
          message:
            "Your email address needs to be confirmed before you can access your accoun",
        });
    }

    const { password: pwd, ...payload } = user.toObject();
    const jwt = new JsonWebToken();
    const { accessToken, accessTokenExpires } = jwt.createAccessToken(payload);
    const refreshToken = jwt.createRefreshToken(payload);
    res.status(200).json({
      user: payload,
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
    const jwt = new JsonWebToken();
    const emailConfirmToken = jwt.createEmailConfirmToken({
      email: user.email,
    });
    emailQueue.add("email", {
      to: user.email,
      mail: new ConfirmationMail({ emailConfirmToken: emailConfirmToken }),
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
    const decoded: any = await JsonWebToken.verify(req.body.refreshToken);
    const user = await User.findById(decoded._id).select("-password").exec();
    if (!user) {
      throw new Error("Refresh Token Error");
    }
    const jwt = new JsonWebToken();
    const payload = user.toObject();
    const { accessToken, accessTokenExpires } = jwt.createAccessToken(payload);
    res.status(200).json({
      accessToken,
      user: payload,
      accessTokenExpires,
    });
  } catch (error) {
    next(error);
  }
};
