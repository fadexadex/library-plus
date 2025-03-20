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

  getNotifications = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId } = req.user;
      const notifications = await generalService.getNotfications(userId);

      res.status(StatusCodes.OK).json(notifications);
    } catch (error) {
      next(error);
    }
  };
  searchBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query.q as string;
      const books = await generalService.searchBooks(query);
      res.status(StatusCodes.OK).json({
        data: books,
      });
    } catch (error) {
      next(error);
    }
  };

  initiateBookPurchase = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { bookId, title, price, quantity } = req.body;
      const { userId } = req.user;
      const { url } = await generalService.initiateBookPurchase(
        bookId,
        userId,
        title,
        price,
        quantity
      );
      res
        .status(StatusCodes.OK)
        .json({ message: "Payment initiation successful", url });
    } catch (error) {
      next(error);
    }
  };

  handleWebhook = async (req: Request, res: Response, next: NextFunction) => {
    const {
      data: {
        object: { amount, amount_details, metadata },
      },
    } = req.body;
    const { bookId, userId } = metadata;

    res.status(StatusCodes.OK).json({ received: true });
  };
}
