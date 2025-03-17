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

  async createNotifications(
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
      RETURNED: "returned",
      RETURN_REQUESTED: "return requested",
    }[status];

    let userMessage = `Your borrow request for the book "${borrowRequest.book.title}" has been ${statusMessage}.`;
    let adminMessage = `The borrow request for the book "${borrowRequest.book.title}" has been ${statusMessage}.`;

    if (status === "RETURNED") {
      userMessage = `Your return request for the book "${borrowRequest.book.title}" has been confirmed.`;
      adminMessage = `The return request for the book "${borrowRequest.book.title}" has been confirmed.`;
    }
    await this.createNotifications(
      borrowRequest.userId,
      userMessage,
      adminMessage
    );
  }

  async logActivity(userId: string, bookId: string, action: string) {
    return await prisma.recentActivity.create({
      data: {
        userId,
        bookId,
        action,
      },
    });
  }

  async getUserActivities(userId: string) {
    return await prisma.recentActivity.findMany({
      where: { userId },
      include: {
        book: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        timestamp: "desc",
      },
    });
  }

  async getNotfications(userId: string) {
    return await prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        time: "desc",
      },
    });
  }
}
