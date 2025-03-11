import { Prisma } from "@prisma/client";

export const formatBookData = (book: any): Prisma.BookCreateInput => {
  return {
    title: book.title,
    author: book.author,
    isbn: book.isbn,
    category: book.category,
    copies: Number(book.copies) || 0, 
    shelf: book.shelf,
    price: parseFloat(book.price) || 0, 
    coverImage: book.coverImage,
    description: book.description,
    stockStatus: book.stockStatus === "IN_STOCK" ? "IN_STOCK" : "OUT_OF_STOCK", 
  };
};