CREATE EXTENSION IF NOT EXISTS pgcrypto;
/*
  Warnings:

  - A unique constraint covering the columns `[verificationToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "verificationToken" SET DEFAULT gen_random_uuid();

-- CreateIndex
CREATE UNIQUE INDEX "User_verificationToken_key" ON "User"("verificationToken");
