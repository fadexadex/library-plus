import { AdminRepository } from "../repository";
import { BorrowStatus, Prisma } from "@prisma/client";
import fs from 'fs/promises';
import Papa from "papaparse";
import { formatBookData } from "../../../utils/formatBookData";

const adminRepo = new AdminRepository();

export class AdminService {
  createBook = async (data: Prisma.BookCreateInput) => {
    return adminRepo.createBook(data);
  };

  batchCreateBooks = async (filePath: string) => {
    const fileData = await fs.readFile(filePath, 'utf-8');

    const { data: books } = Papa.parse(fileData, {
      header: true,
      skipEmptyLines: true,
    });
  

    const formattedBooks = books.map(formatBookData);

    return adminRepo.batchCreateBooks(formattedBooks as Prisma.BookCreateInput[]);
  };

  getBorrowRequests = async (status: BorrowStatus) => {
    return adminRepo.getBorrowRequests(status);
  }

  getBorrowRequest = async (id: string) => {
    return adminRepo.getBorrowRequest(id);
  }

  updateBorrowRequest = async (id: string, status: BorrowStatus, rejectionReason?: string) => {
    return adminRepo.updateBorrowRequestStatus(id, status, rejectionReason);
  }

  getAllActivities = async () => {
    return adminRepo.getAllActivities()
  }
}
