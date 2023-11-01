import * as jwt from "jsonwebtoken";
import config from "../config/config";

type AnyObject = {
  [key: string]: any;
};

class JsonWebToken<T> {
  data: AnyObject;
  constructor(data: AnyObject) {
    this.data = data;
  }

  public createAccessToken(): {
    accessToken: string;
    accessTokenExpires: number;
  } {
    return {
      accessToken: jwt.sign(this.data, config.jwt.secret, { expiresIn: 60 * 60 }),
      accessTokenExpires: Math.floor(Date.now() / 1000) + 45 * 60,
    };
  }

  public createRefreshToken(): string {
    return jwt.sign(this.data, config.jwt.secret, { expiresIn: "365d" });
  }

  public createEmailConfirmToken(): string {
    return jwt.sign(this.data, config.jwt.secret, { expiresIn: "1h" });
  }

  static verify<T>(token: string): Promise<T> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, config.jwt.secret, (err, decoded) => {
        if (!err) resolve(decoded as T);
        else reject(err);
      });
    });
  }
}

export default JsonWebToken;
