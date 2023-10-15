import { Request, Response, NextFunction } from "express";
import User from "../../../../model/user";
import JsonWebToken from "../../../../service/jwt";
import Hash from "../../../../service/hast";

const accessTokenExpires = () => Math.floor(Date.now() / 1000) + 10 * 60;

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password }: { email: string; password: string } = req.body;
  try {
    const user = await User.findOne({ email }).exec();
    if (!user || !(await Hash.compare(password, user.password))) {
      return res.status(400).json({ message: "not found" });
    }
    const { password: pwd, ...others } = user.toJSON();
    const accessToken = new JsonWebToken({
      expireIn: 10 * 60,
      payload: others,
    });
    const refreshToken = new JsonWebToken({
      payload: others,
    });
    res.status(200).json({
      user: others,
      accessToken: accessToken.token,
      refreshToken: refreshToken.token,
      accessTokenExpires: accessTokenExpires(),
    });
  } catch (error) {
    next(error);
  }
};

export const register = async (req: Request, res: Response) => {
  const { name, email, password, avatar } = req.body;
  const user = new User({ name, email, password, avatar });
  await user.save();
  res.status(200).json({ message: "success" });
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const decoded: any = await JsonWebToken.verify(req.body.refreshToken);
    const user = await User.findById(decoded._id).exec();
    if (!user) {
      return res.status(400).json({ message: "Not Found" });
    }
    const newAccessToken = new JsonWebToken({
      payload: user?.toJSON(),
      expireIn: 10 * 60,
    });
    res.status(200).json({
      accessToken: newAccessToken.token,
      user: decoded,
      accessTokenExpires: accessTokenExpires(),
    });
  } catch (error) {
    next(error);
  }
};
