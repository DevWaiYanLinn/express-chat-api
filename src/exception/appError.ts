import { HttpCode } from "../types";

class AppError extends Error {
  public readonly name: string;
  public readonly httpCode: HttpCode;

  constructor(name: string, httpCode: HttpCode, description: string) {
    super(description);
    this.name = name;
    this.httpCode = httpCode;
    Error.captureStackTrace(this)
  }
}

export default AppError
