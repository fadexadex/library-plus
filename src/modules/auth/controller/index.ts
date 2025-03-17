import { AuthService } from "../service";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

const authService = new AuthService();

export class AuthController {
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await authService.register(req.body);
      res.status(StatusCodes.CREATED).json(user);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = await authService.login(req.body);
      res.status(StatusCodes.OK).json(token );
    } catch (error) {
      next(error);
    }
  };

  adminLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = await authService.login(req.body, "ADMIN");
      res.status(StatusCodes.OK).json(token );
    } catch (error) {
      next(error);
    }
  };

  getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await authService.getMe(req.user.email);
      const { password, ...safeUser } = user;
      res.status(StatusCodes.OK).json(safeUser);
    } catch (error) {
      next(error);
    }
  };
}
