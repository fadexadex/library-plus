/*
  Warnings:

  - The primary key for the `Book` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `book_id` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `cover_image` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `stock_status` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Book` table. All the data in the column will be lost.
  - The primary key for the `BorrowedBook` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `book_id` on the `BorrowedBook` table. All the data in the column will be lost.
  - You are about to drop the column `borrow_date` on the `BorrowedBook` table. All the data in the column will be lost.
  - You are about to drop the column `borrowed_book_id` on the `BorrowedBook` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `BorrowedBook` table. All the data in the column will be lost.
  - You are about to drop the column `customer_id` on the `BorrowedBook` table. All the data in the column will be lost.
  - You are about to drop the column `due_date` on the `BorrowedBook` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `BorrowedBook` table. All the data in the column will be lost.
  - The primary key for the `Notification` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `customer_id` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `notification_id` on the `Notification` table. All the data in the column will be lost.
  - The primary key for the `Purchase` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `book_id` on the `Purchase` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Purchase` table. All the data in the column will be lost.
  - You are about to drop the column `customer_id` on the `Purchase` table. All the data in the column will be lost.
  - You are about to drop the column `purchase_id` on the `Purchase` table. All the data in the column will be lost.
  - You are about to drop the column `transaction_id` on the `Purchase` table. All the data in the column will be lost.
  - The primary key for the `RecentActivity` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `activity_id` on the `RecentActivity` table. All the data in the column will be lost.
  - You are about to drop the column `book_id` on the `RecentActivity` table. All the data in the column will be lost.
  - You are about to drop the column `customer_id` on the `RecentActivity` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `User` table. All the data in the column will be lost.
  - The required column `bookId` was added to the `Book` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `coverImage` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stockStatus` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bookId` to the `BorrowedBook` table without a default value. This is not possible if the table is not empty.
  - The required column `borrowedBookId` was added to the `BorrowedBook` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `updatedAt` to the `BorrowedBook` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `BorrowedBook` table without a default value. This is not possible if the table is not empty.
  - The required column `notificationId` was added to the `Notification` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `userId` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bookId` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - The required column `purchaseId` was added to the `Purchase` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `userId` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - The required column `activityId` was added to the `RecentActivity` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `bookId` to the `RecentActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `RecentActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - The required column `userId` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "BorrowedBook" DROP CONSTRAINT "BorrowedBook_book_id_fkey";

-- DropForeignKey
ALTER TABLE "BorrowedBook" DROP CONSTRAINT "BorrowedBook_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_book_id_fkey";

-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "RecentActivity" DROP CONSTRAINT "RecentActivity_book_id_fkey";

-- DropForeignKey
ALTER TABLE "RecentActivity" DROP CONSTRAINT "RecentActivity_customer_id_fkey";

-- AlterTable
ALTER TABLE "Book" DROP CONSTRAINT "Book_pkey",
DROP COLUMN "book_id",
DROP COLUMN "cover_image",
DROP COLUMN "created_at",
DROP COLUMN "stock_status",
DROP COLUMN "updated_at",
ADD COLUMN     "bookId" TEXT NOT NULL,
ADD COLUMN     "coverImage" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "stockStatus" "StockStatus" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "Book_pkey" PRIMARY KEY ("bookId");

-- AlterTable
ALTER TABLE "BorrowedBook" DROP CONSTRAINT "BorrowedBook_pkey",
DROP COLUMN "book_id",
DROP COLUMN "borrow_date",
DROP COLUMN "borrowed_book_id",
DROP COLUMN "created_at",
DROP COLUMN "customer_id",
DROP COLUMN "due_date",
DROP COLUMN "updated_at",
ADD COLUMN     "bookId" TEXT NOT NULL,
ADD COLUMN     "borrowDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "borrowedBookId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD CONSTRAINT "BorrowedBook_pkey" PRIMARY KEY ("borrowedBookId");

-- AlterTable
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_pkey",
DROP COLUMN "customer_id",
DROP COLUMN "notification_id",
ADD COLUMN     "notificationId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD CONSTRAINT "Notification_pkey" PRIMARY KEY ("notificationId");

-- AlterTable
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_pkey",
DROP COLUMN "book_id",
DROP COLUMN "created_at",
DROP COLUMN "customer_id",
DROP COLUMN "purchase_id",
DROP COLUMN "transaction_id",
ADD COLUMN     "bookId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "purchaseId" TEXT NOT NULL,
ADD COLUMN     "transactionId" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD CONSTRAINT "Purchase_pkey" PRIMARY KEY ("purchaseId");

-- AlterTable
ALTER TABLE "RecentActivity" DROP CONSTRAINT "RecentActivity_pkey",
DROP COLUMN "activity_id",
DROP COLUMN "book_id",
DROP COLUMN "customer_id",
ADD COLUMN     "activityId" TEXT NOT NULL,
ADD COLUMN     "bookId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD CONSTRAINT "RecentActivity_pkey" PRIMARY KEY ("activityId");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "created_at",
DROP COLUMN "first_name",
DROP COLUMN "last_name",
DROP COLUMN "updated_at",
DROP COLUMN "user_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("userId");

-- AddForeignKey
ALTER TABLE "BorrowedBook" ADD CONSTRAINT "BorrowedBook_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("bookId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BorrowedBook" ADD CONSTRAINT "BorrowedBook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("bookId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecentActivity" ADD CONSTRAINT "RecentActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecentActivity" ADD CONSTRAINT "RecentActivity_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("bookId") ON DELETE RESTRICT ON UPDATE CASCADE;
