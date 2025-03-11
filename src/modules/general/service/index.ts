import { GeneralRepository } from "../repository";
import { BorrowedBook, BorrowStatus } from "@prisma/client";

const generalRepo = new GeneralRepository();

export class GeneralService {
  async findAllBooks(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const { books, count } = await generalRepo.findAllBooks(skip, limit);

    return {
      books,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        itemsPerPage: limit,
      },
    };
  }

  async findBookById(id: string) {
    return await generalRepo.findBookById(id);
  }

  async createBorrowRequestNotifications(
    borrowRequest: BorrowedBook & { book: { title: string } }
  ) {
    return await generalRepo.createBorrowRequestNotifications(borrowRequest);
  }

  async createUpdateBorrowRequestNotifications(
    borrowRequest: BorrowedBook & {
      book: { title: string };
      user: { email: string };
    },
    status: BorrowStatus
  ) {
    return await generalRepo.createUpdateBorrowRequestNotifications(
      borrowRequest,
      status
    );
  }

  async createReturnRequestNotifications(
    returnRequest: BorrowedBook & { book: { title: string } }
  ) {
    const userMessage = `Your return request for the book "${returnRequest.book.title}" has been submitted.`;
    const adminMessage = `A new return request has been made for the book "${returnRequest.book.title}".`;

    await generalRepo.createNotifications(
      returnRequest.userId,
      userMessage,
      adminMessage
    );
  }

  async logActivity(userId: string, bookId: string, action: string) {
    return await generalRepo.logActivity(userId, bookId, action);
  }

  async getNotfications(userId: string) {
    return await generalRepo.getNotfications(userId);
  }
}
