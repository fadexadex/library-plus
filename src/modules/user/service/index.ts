import { BorrowedBook } from "@prisma/client";
import { UserRepository } from "../repository";

const userRepo = new UserRepository();

export class UserService {
  async borrowBook(userId: string, bookId: string) {
    return await userRepo.borrowBook(userId, bookId);
  }
  async submitReturnRequest(userId: string, bookId: string) {
    return await userRepo.submitReturnRequest(userId, bookId);
  }

  async getBorrowRequests(userId: string) {
    return await userRepo.getBorrowRequests(userId);
  }

  async getBorrowRequest(userId: string, id: string) {
    return await userRepo.getBorrowRequest(userId, id);
  }

  async getUserActivities(userId: string) {
    return await userRepo.getUserActivities(userId);
  }
}
