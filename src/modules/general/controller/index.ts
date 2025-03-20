import { GeneralService } from "../service";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import EmailService from "../../../utils/nodemailer";

const generalService = new GeneralService();
const emailService = new EmailService();

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
        parseInt(quantity)
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
        object: { amount, metadata },
      },
    } = req.body;
    const { bookId, userId, quantity } = metadata;
    setImmediate(async () => {
      try {
        const purchase = await generalService.handleWebhookConfirmation(
          userId,
          bookId,
          amount,
          quantity
        );

        console.log("Purchase created successfully");
        const email = purchase.user.email;
        const bookTitle = purchase.book.title;
        const { purchaseId } = purchase;

        await emailService.notifyUserAboutPurchaseConfirmation(
          email,
          bookTitle,
          purchaseId,
          quantity
        );

        console.log("Purchase finalized successfully");
      } catch (error) {
        console.error("Failed Finalize purchase", error);
      }
    });

    res.status(StatusCodes.OK).json({ received: true });
  };
}
