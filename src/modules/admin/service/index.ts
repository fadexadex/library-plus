import { AdminRepository } from "../repository";
import { BorrowStatus, Prisma } from "@prisma/client";
import fs from "fs/promises";
import Papa from "papaparse";
import { formatBookData } from "../../../utils/formatBookData";
import { processQuery, fetchDataFromDB, formatAIResponse  } from "../../../utils/query.engine";

const adminRepo = new AdminRepository();

export class AdminService {

  askAI= async(query: string)=>{

    const decision = await processQuery(query);
    if (!decision.needsDatabaseQuery) return decision?.explanation;

    const data = await fetchDataFromDB(decision.sqlQuery);
    return await formatAIResponse(query, data);
  }

  createBook = async (data: Prisma.BookCreateInput) => {
    return adminRepo.createBook(data);
  };

  updateBook = async (id: string, data: Prisma.BookUpdateInput) => {
    return adminRepo.updateBook(id, data);
  };

  deleteBook = async (id: string) => {
    return adminRepo.deleteBook(id);
  };

  batchCreateBooks = async (filePath: string) => {
    const fileData = await fs.readFile(filePath, "utf-8");

    const { data: books } = Papa.parse(fileData, {
      header: true,
      skipEmptyLines: true,
    });

    const formattedBooks = books.map(formatBookData);

    return adminRepo.batchCreateBooks(
      formattedBooks as Prisma.BookCreateInput[]
    );
  };

  getBorrowRequests = async (status: BorrowStatus) => {
    return adminRepo.getBorrowRequests(status);
  };

  getBorrowRequest = async (id: string) => {
    return adminRepo.getBorrowRequest(id);
  };

  updateBorrowRequest = async (
    id: string,
    status: BorrowStatus,
    rejectionReason?: string
  ) => {
    return adminRepo.updateBorrowRequestStatus(id, status, rejectionReason);
  };

  getAllActivities = async () => {
    return adminRepo.getAllActivities();
  };

  getAllPurchases = async () => {
    return adminRepo.getAllPurchases();
  }
}
