/*
  Warnings:

  - You are about to drop the column `accessPasword` on the `organizations` table. All the data in the column will be lost.
  - Added the required column `accessPassword` to the `organizations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "organizations" DROP COLUMN "accessPasword",
ADD COLUMN     "accessPassword" TEXT NOT NULL;
