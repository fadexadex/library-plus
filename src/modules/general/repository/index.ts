import { prisma } from "../../../utils/db";
import { BorrowedBook, BorrowStatus } from "@prisma/client";

export class GeneralRepository {
  async findAllBooks(skip: number, take: number) {
    const [books, count] = await Promise.all([
      prisma.book.findMany({
        skip,
        take,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.book.count(),
    ]);

    return { books, count };
  }

  async findBookById(id: string) {
    return await prisma.book.findUnique({
      where: {
        bookId: id,
      },
    });
  }

  private async createNotifications(
    userId: string,
    userMessage: string,
    adminMessage: string
  ) {
    await prisma.notification.create({
      data: {
        userId,
        message: userMessage,
      },
    });

    const admins = await prisma.user.findMany({
      where: {
        role: "ADMIN",
      },
    });

    const adminNotifications = admins.map((admin) => ({
      userId: admin.userId,
      message: adminMessage,
    }));

    await prisma.notification.createMany({
      data: adminNotifications,
    });
  }

  async createBorrowRequestNotifications(
    borrowRequest: BorrowedBook & { book: { title: string } }
  ) {
    const userMessage = `Your borrow request for the book "${borrowRequest.book.title}" has been created.`;
    const adminMessage = `A new borrow request has been made for the book "${borrowRequest.book.title}".`;

    await this.createNotifications(
      borrowRequest.userId,
      userMessage,
      adminMessage
    );
  }

  async createUpdateBorrowRequestNotifications(
    borrowRequest: BorrowedBook & {
      book: { title: string };
      user: { email: string };
    },
    status: BorrowStatus
  ) {
    const statusMessage = {
      APPROVED: "approved",
      PENDING: "pending",
      REJECTED: "rejected",
      OVERDUE: "overdue",
    }[status];

    const userMessage = `Your borrow request for the book "${borrowRequest.book.title}" has been ${statusMessage}.`;
    const adminMessage = `The borrow request for the book "${borrowRequest.book.title}" has been ${statusMessage}.`;

    await this.createNotifications(
      borrowRequest.userId,
      userMessage,
      adminMessage
    );
  }
}
