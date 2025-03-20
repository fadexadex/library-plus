import { GeneralRepository } from "../repository";
import { BorrowedBook, BorrowStatus } from "@prisma/client";
const stripe = require("stripe")(process.env.STRIPE_TEST_KEY);
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

  async searchBooks(query: string) {
    return await generalRepo.searchBooks(query);
  }

  async logActivity(userId: string, bookId: string, action: string) {
    return await generalRepo.logActivity(userId, bookId, action);
  }

  async getNotfications(userId: string) {
    return await generalRepo.getNotfications(userId);
  }

  async initiateBookPurchase(
    bookId: string,
    userId: string,
    title: string,
    price: number,
    quantity: number
  ) {
    return await stripe.checkout.sessions.create({
      payment_intent_data: {
        metadata: {
          bookId,
          userId,
          quantity
        },
      },
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: title,
            },
            unit_amount: price * 100,
          },
          quantity,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/complete",
      cancel_url: "http://localhost:3000/cancel",
    });
  }

  async handleWebhookConfirmation(userId: string, bookId: string) {}
}
