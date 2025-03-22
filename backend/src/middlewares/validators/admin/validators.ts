import { chatQuerySchema } from "./schema";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../../middlewares";

export class AdminValidator {
  validateChatQuery = (req: Request, res: Response, next: NextFunction) => {
    const { error } = chatQuerySchema.validate(req.body, { abortEarly: false });
    if (error) {
      next(
        new AppError(
          error.details.map((err) => err.message).join(", "),
          StatusCodes.BAD_REQUEST
        )
      );
    } else {
      next();
    }
  };
}