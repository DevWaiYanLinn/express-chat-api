import * as jwt from "jsonwebtoken";

class JsonWebToken {
  constructor() {}

  public createAccessToken(payload: any): {
    accessToken: string;
    accessTokenExpires: number;
  } {
    return {
      accessToken: jwt.sign(payload, "secret", { expiresIn: 60 * 60 }),
      accessTokenExpires: Math.floor(Date.now() / 1000) + 45 * 60,
    };
  }

  public createRefreshToken(payload: any): string {
    return jwt.sign(payload, "secret", { expiresIn: "365d" });
  }

  public createEmailConfirmToken(payload: any): string {
    return jwt.sign(payload, "secret", { expiresIn: "1h" });
  }

  static verify(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, "secret", (err, decoded) => {
        if (!err) resolve(decoded);
        else reject(err);
      });
    });
  }
}

export default JsonWebToken;
