/*
  Warnings:

  - You are about to drop the column `isRevoked` on the `RefreshToken` table. All the data in the column will be lost.
  - You are about to drop the column `tokenHash` on the `RefreshToken` table. All the data in the column will be lost.
  - Added the required column `token` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RefreshToken" DROP COLUMN "isRevoked",
DROP COLUMN "tokenHash",
ADD COLUMN     "token" TEXT NOT NULL;
