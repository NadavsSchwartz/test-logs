/*
  Warnings:

  - You are about to drop the `BaseModel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Team` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[projectId]` on the table `ProjectPortfolio` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ProjectPortfolio" DROP CONSTRAINT "ProjectPortfolio_userId_fkey";

-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_projectId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_teamId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "projectId" TEXT;

-- DropTable
DROP TABLE "BaseModel";

-- DropTable
DROP TABLE "Team";

-- CreateIndex
CREATE UNIQUE INDEX "ProjectPortfolio_projectId_key" ON "ProjectPortfolio"("projectId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
