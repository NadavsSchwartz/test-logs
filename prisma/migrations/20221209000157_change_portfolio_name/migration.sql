/*
  Warnings:

  - You are about to drop the column `projectPortfolioId` on the `EngineeringNotebookStep` table. All the data in the column will be lost.
  - You are about to drop the `ProjectPortfolio` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `portfolioId` to the `EngineeringNotebookStep` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EngineeringNotebookStep" DROP CONSTRAINT "EngineeringNotebookStep_projectPortfolioId_fkey";

-- DropForeignKey
ALTER TABLE "GridStep" DROP CONSTRAINT "GridStep_projectPortfolioId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectPortfolio" DROP CONSTRAINT "ProjectPortfolio_projectId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_projectId_fkey";

-- DropIndex
DROP INDEX "EngineeringNotebookStep_userId_idx";

-- DropIndex
DROP INDEX "GridStep_userId_idx";

-- AlterTable
ALTER TABLE "EngineeringNotebookStep" DROP COLUMN "projectPortfolioId",
ADD COLUMN     "portfolioId" TEXT NOT NULL;

-- DropTable
DROP TABLE "ProjectPortfolio";

-- CreateTable
CREATE TABLE "Portfolio" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3),
    "submitted" BOOLEAN DEFAULT false,

    CONSTRAINT "Portfolio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProjectToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Portfolio_projectId_key" ON "Portfolio"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectToUser_AB_unique" ON "_ProjectToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectToUser_B_index" ON "_ProjectToUser"("B");

-- AddForeignKey
ALTER TABLE "GridStep" ADD CONSTRAINT "GridStep_projectPortfolioId_fkey" FOREIGN KEY ("projectPortfolioId") REFERENCES "Portfolio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EngineeringNotebookStep" ADD CONSTRAINT "EngineeringNotebookStep_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToUser" ADD CONSTRAINT "_ProjectToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToUser" ADD CONSTRAINT "_ProjectToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
