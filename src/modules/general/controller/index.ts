import { GeneralService } from "../service";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

const generalService = new GeneralService();

export class GeneralController {
  getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number.parseInt(req.query.page as string) || 1;
      const limit = Number.parseInt(req.query.limit as string) || 12;
      const books = await generalService.findAllBooks(page, limit);
      res.status(StatusCodes.OK).json(books);
    } catch (error) {
      next(error);
    }
  };
  getBookById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const book = await generalService.findBookById(id);

      if (!book) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Book not found",
        });
      }

      res.status(StatusCodes.OK).json(book);
    } catch (error) {
      next(error);
    }
  };

  getNotifications = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.user;
      const notifications = await generalService.getNotfications(userId);

      res.status(StatusCodes.OK).json(notifications);
    } catch (error) {
      next(error);
    }
  }
}
