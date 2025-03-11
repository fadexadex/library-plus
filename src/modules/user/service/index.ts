import { BorrowedBook } from "@prisma/client";
import { UserRepository } from "../repository";

const userRepo = new UserRepository();

export class UserService {
  async borrowBook(userId: string, bookId: string) {
    return await userRepo.borrowBook(userId, bookId);
  }


}
