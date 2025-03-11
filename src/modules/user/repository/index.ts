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

 

}
