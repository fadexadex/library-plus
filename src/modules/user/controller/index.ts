import { UserService } from "../service";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../../middlewares";
import EmailService from "../../../utils/nodemailer";
import { GeneralService } from "../../../modules/general/service";

const userService = new UserService();
const emailService = new EmailService();
const generalService = new GeneralService();

export class UserController {
  async borrowBook(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.user;
      const { id } = req.params;
      const url = `${process.env.BASE_URL}/admin/borrow-requests`;

      const borrowedBook = await userService.borrowBook(userId, id);

      setImmediate(async () => {
        try {
          await emailService.notifyAdminsAboutBorrowRequest(
            borrowedBook.book.title,
            url
          );
          await generalService.createBorrowRequestNotifications(borrowedBook);
        } catch (error) {
          console.error("Failed to send notifications:", error);
        }
      });

      res.status(StatusCodes.CREATED).json({
        message:
          "Book borrow request submitted successfully, awaiting admin approval",
      });
    } catch (error) {
      if (error.code === "P2002") {
        return next(
          new AppError(
            "You have already borrowed this book. Please return it before borrowing again.",
            StatusCodes.BAD_REQUEST
          )
        );
      }
      next(error);
    }
  }
}
