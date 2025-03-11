import { Request, Response, NextFunction } from "express";
import { validateIdSchema , createBookSchema, statusSchema} from "./schemas";
import { AppError } from "../../../middlewares/error.handler";
import { StatusCodes } from "http-status-codes";

export class BookValidator {
  validateId = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { error } = validateIdSchema.validate(req.params);
    if (error) {
      next(
        new AppError(
          error.details.map((err) => err.message).join(", "),
          StatusCodes.BAD_REQUEST
        )
      );
    }
    next();
  };
    validateCreateBookBody = (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
  
      const { error } = createBookSchema.validate(req.body);
      if (error) {
        next(
          new AppError(
            error.details.map((err) => err.message).join(", "),
            StatusCodes.BAD_REQUEST
          )
        );
      }
      next();
    };
    
  validateStatusQuery = (req: Request, res: Response, next: NextFunction) => {
    const { error } = statusSchema.validate(req.query);
    if (error) {
      next(
        new AppError(
          error.details.map((err) => err.message).join(", "),
          StatusCodes.BAD_REQUEST
        )
      );
    }
    next();
  };
  validateStatusBody = (req: Request, res: Response, next: NextFunction) => {
    const { error } = statusSchema.validate(req.body);
    if (error) {
      next(
        new AppError(
          error.details.map((err) => err.message).join(", "),
          StatusCodes.BAD_REQUEST
        )
      );
    }
    next();
  }
}
