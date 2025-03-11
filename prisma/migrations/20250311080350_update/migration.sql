/*
  Warnings:

  - The primary key for the `BorrowedBook` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `borrowedBookId` on the `BorrowedBook` table. All the data in the column will be lost.
  - The required column `borrowId` was added to the `BorrowedBook` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "BorrowedBook" DROP CONSTRAINT "BorrowedBook_pkey",
DROP COLUMN "borrowedBookId",
ADD COLUMN     "approvalCode" TEXT,
ADD COLUMN     "borrowId" TEXT NOT NULL,
ADD COLUMN     "rejectionReason" TEXT,
ADD CONSTRAINT "BorrowedBook_pkey" PRIMARY KEY ("borrowId");
