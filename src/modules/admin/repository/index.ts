import { Prisma, BorrowStatus } from "@prisma/client";
import { prisma } from "../../../utils/db";

export class AdminRepository {
  private generateApprovalCode(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
  async createBook(data: Prisma.BookCreateInput) {
    return await prisma.book.create({
      data,
    });
  }

  async batchCreateBooks(data: Prisma.BookCreateInput[]) {
    return await prisma.book.createMany({
      data,
      skipDuplicates: true,
    });
  }

  async findAdmins() {
    return await prisma.user.findMany({
      where: {
        role: "ADMIN",
      },
    });
  }

  async getBorrowRequests(status?: BorrowStatus) {
    return await prisma.borrowedBook.findMany({
      where: {
        status: status || undefined,
      },
      include: {
        book: {
          select: {
            title: true,
          },
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async getBorrowRequest(id: string) {
    return await prisma.borrowedBook.findUnique({
      where: {
        borrowId: id,
      },
      include: {
        book: {
          select: {
            title: true,
          },
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async updateBorrowRequestStatus(
    borrowId: string,
    status: BorrowStatus,
    rejectionReason?: string
  ) {
    const data: Prisma.BorrowedBookUpdateInput = {
      status,
      rejectionReason: status === "REJECTED" ? rejectionReason : null,
      approvalCode: status === "APPROVED" ? this.generateApprovalCode() : null,
      returned: status === "RETURNED" ? true : undefined,
    };

    return await prisma.borrowedBook.update({
      where: {
        borrowId,
      },
      data,
      include: {
        book: {
          select: {
            title: true,
          },
        },
        user: {
          select: {
            email: true,
          },
        },
      },
    });
  }

  getAllActivities() {
    return prisma.recentActivity.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        book: {
          select: {
            title: true,
          },
        },
      },
    });
  }
}
