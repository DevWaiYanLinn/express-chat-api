import { Request, Response, NextFunction } from "express";
export default (schema: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.body, { abortEarly: false });
      next();
    } catch (err: any) {
      const mapError = err.details.map((e: any) => {
        return { [e.context.label]: e.message };
      });
      res.status(422).json(mapError);
    }
  };
};
