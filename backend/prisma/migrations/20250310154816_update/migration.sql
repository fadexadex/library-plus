/*
  Warnings:

  - A unique constraint covering the columns `[userId,bookId]` on the table `BorrowedBook` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "BorrowedBook_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "BorrowedBook_userId_bookId_key" ON "BorrowedBook"("userId", "bookId");
