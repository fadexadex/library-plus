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
          await generalService.logActivity(
            userId,
            borrowedBook.bookId,
            "Borrow request submitted"
          );
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

  async submitReturnRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.user;
      const { id } = req.params;
      const url = `${process.env.BASE_URL}/admin/return-requests`;

      const returnRequest = await userService.submitReturnRequest(userId, id);

      setImmediate(async () => {
        try {
          await emailService.notifyAdminsAboutReturnRequest(
            returnRequest.book.title,
            url
          );
          await generalService.createReturnRequestNotifications(returnRequest);
          await generalService.logActivity(
            userId,
            returnRequest.bookId,
            "Return request submitted"
          );
        } catch (error) {
          console.error("Failed to send notifications:", error);
        }
      });

      res.status(StatusCodes.CREATED).json({
        message:
          "Book return request submitted successfully, awaiting admin approval",
      });
    }
    catch (error) {
      next(error);
    }
  }

  async getBorrowRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.user;
      const borrowRequests = await userService.getBorrowRequests(userId);

      res.status(StatusCodes.OK).json(borrowRequests);
    } catch (error) {
      next(error);
    }
  }
  async getBorrowRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.user;
      const { id } = req.params;
      const borrowRequest = await userService.getBorrowRequest(userId, id);

      if (!borrowRequest) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Borrow request not found",
        });
      }

      res.status(StatusCodes.OK).json(borrowRequest);
    } catch (error) {
      next(error);
    }
  }
  async getUserActivities(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.user;
      const activities = await userService.getUserActivities(userId);

      res.status(StatusCodes.OK).json(activities);
    } catch (error) {
      next(error);
    }
  }
}
