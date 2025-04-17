/*
  Warnings:

  - You are about to drop the column `imaage` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `products` DROP COLUMN `imaage`,
    ADD COLUMN `image` VARCHAR(191) NULL;
