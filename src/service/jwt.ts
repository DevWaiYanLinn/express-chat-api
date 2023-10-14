import * as jwt from "jsonwebtoken";

class JsonWebToken {
  private _token: string | null = null;
  private _expireIn: any = null;

  constructor({ expireIn, payload }:any) {
    this._expireIn = expireIn || null;
    this.generateToken(payload);
  }

  private generateToken(payload: any): void {
    const secret = "secret";
    const options = { expiresIn: this._expireIn || "365d" };

    try {
      this._token = jwt.sign(payload, secret, options) as string;
    } catch (error) {
      console.error("JWT signing error:", error);
    }
  }

  get token(): string | null {
    return this._token;
  }

  static verify(token: string) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, "secret", (err, decoded) => {
        if (!err) resolve(decoded);
        else reject(err);
      });
    });
  }
}

export default JsonWebToken;
