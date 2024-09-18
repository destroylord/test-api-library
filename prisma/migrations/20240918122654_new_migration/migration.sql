/*
  Warnings:

  - You are about to drop the column `borrowed` on the `book` table. All the data in the column will be lost.
  - You are about to drop the column `memberId` on the `book` table. All the data in the column will be lost.
  - You are about to drop the `penalty` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[memberId,bookId]` on the table `BorrowedBook` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `book` DROP FOREIGN KEY `Book_memberId_fkey`;

-- DropForeignKey
ALTER TABLE `borrowedbook` DROP FOREIGN KEY `BorrowedBook_bookId_fkey`;

-- DropForeignKey
ALTER TABLE `borrowedbook` DROP FOREIGN KEY `BorrowedBook_memberId_fkey`;

-- DropForeignKey
ALTER TABLE `penalty` DROP FOREIGN KEY `Penalty_memberId_fkey`;

-- AlterTable
ALTER TABLE `book` DROP COLUMN `borrowed`,
    DROP COLUMN `memberId`,
    ADD COLUMN `borrowedCount` INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE `penalty`;

-- CreateIndex
CREATE UNIQUE INDEX `BorrowedBook_memberId_bookId_key` ON `BorrowedBook`(`memberId`, `bookId`);

-- AddForeignKey
ALTER TABLE `BorrowedBook` ADD CONSTRAINT `BorrowedBook_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `Member`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BorrowedBook` ADD CONSTRAINT `BorrowedBook_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `Book`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
