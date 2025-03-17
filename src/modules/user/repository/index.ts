import { BorrowedBook } from "@prisma/client";
import { prisma } from "../../../utils/db";
import { AppError } from "../../../middlewares";
import { StatusCodes } from "http-status-codes";

export class UserRepository {
  async borrowBook(userId: string, bookId: string) {
    const book = await prisma.book.findUnique({ where: { bookId } });
    if (!book) throw new AppError("Book not found", StatusCodes.NOT_FOUND);

    return prisma.borrowedBook.create({
      data: {
        userId,
        bookId,
      },
      include: {
        book: {
          select: {
            title: true,
          },
        },
      },
    });
  }

  async getBorrowRequests(userId: string) {
    return prisma.borrowedBook.findMany({
      where: {
        userId,
      },
      include: {
        book: {
          select: {
            title: true,
          },
        },
      },
    });
  }

  async getBorrowRequest(userId: string, id: string) {
    return prisma.borrowedBook.findFirst({
      where: {
        userId,
        borrowId: id,
      },
      include: {
        book: {
          select: {
            title: true,
          },
        },
      },
    });
  }
  
  async getUserActivities(userId: string) {
    return prisma.recentActivity.findMany({
      where: { userId },
      include: {
        book: {
          select: {
            title: true,
          },
        },
      },
    });
  }

  async submitReturnRequest(userId: string, borrowId: string) {

    const borrowRequest = await prisma.borrowedBook.findFirst({
      where: {
        userId,
        borrowId: borrowId,
      },
      include: {
        book: {
          select: {
            title: true,
          },
        },
      },
    });

    if (!borrowRequest)
      throw new AppError("Borrow request not found", StatusCodes.NOT_FOUND);

    return prisma.borrowedBook.update({
      where: {
        borrowId: borrowId,
      },
      data: {
        status: "RETURN_REQUESTED",
      },
      include: {
        book: {
          select: {
            title: true,
          },
        },
      },
    });

  }
}
