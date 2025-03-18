import { AdminService } from "../service";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../../../middlewares";
import { StatusCodes } from "http-status-codes";
import uploadImageToCloudinary from "../../../utils/cloudinary";
import fs from "fs";
import { BorrowStatus } from "@prisma/client";
import EmailService from "../../../utils/nodemailer";
import { GeneralService } from "../../../modules/general/service";

const adminService = new AdminService();
const emailService = new EmailService();
const generalService = new GeneralService();

export class AdminController {
  createBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body.coverImage = await uploadImageToCloudinary(req.file.path);

      await adminService.createBook(req.body);
      res
        .status(StatusCodes.CREATED)
        .json({ message: "Book created Successfully" });
    } catch (error) {
      next(error);
    }
  };

  batchCreateBooks = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const createdBooks = await adminService.batchCreateBooks(req.file.path);
      fs.unlinkSync(req.file.path);
      res
        .status(StatusCodes.CREATED)
        .json({ message: `Books created: ${createdBooks.count}` });
    } catch (error) {
      next(error);
    }
  };

  getBorrowRequests = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { status } = req.query;
      const borrowRequests = await adminService.getBorrowRequests(
        status as BorrowStatus
      );
      if (!borrowRequests.length) {
        throw new AppError("No borrow requests found", StatusCodes.NOT_FOUND);
      }
      res.status(StatusCodes.OK).json(borrowRequests);
    } catch (error) {
      next(error);
    }
  };

  getBorrowRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const borrowRequest = await adminService.getBorrowRequest(id);
      if (!borrowRequest) {
        throw new AppError("Borrow request not found", StatusCodes.NOT_FOUND);
      }
      res.status(StatusCodes.OK).json(borrowRequest);
    } catch (error) {
      next(error);
    }
  };

  updateBorrowRequestStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const { status, rejectionReason } = req.body;
      const updatedRequest = await adminService.updateBorrowRequest(
        id,
        status,
        rejectionReason
      );

      setImmediate(async () => {
        if (status === "RETURNED") {
          await generalService.createUpdateBorrowRequestNotifications(
            updatedRequest,
            status
          );
          await generalService.logActivity(
            updatedRequest.userId,
            updatedRequest.bookId,
            `return request confirmed ${status.toLowerCase()}`
          );
        } else {
          const requestLink = `${process.env.BASE_URL}/user/borrow-requests/${id}`;
          await emailService.notifyUserAboutBorrowRequestStatus(
            updatedRequest.user.email,
            updatedRequest.book.title,
            status,
            requestLink
          );
          await generalService.createUpdateBorrowRequestNotifications(
            updatedRequest,
            status
          );
          await generalService.logActivity(
            updatedRequest.userId,
            updatedRequest.bookId,
            `Borrow request ${status.toLowerCase()}`
          );
        }
      });

      res
        .status(StatusCodes.OK)
        .json({ message: "Borrow request updated successfully" });
    } catch (error) {
      next(error);
    }
  };

  getAllActivities = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const activities = await adminService.getAllActivities();
      res.status(StatusCodes.OK).json(activities);
    } catch (error) {
      next(error);
    }
  };
}
