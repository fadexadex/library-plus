/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `BorrowedBook` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BorrowedBook_userId_key" ON "BorrowedBook"("userId");
