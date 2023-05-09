/*
  Warnings:

  - You are about to drop the `ProjectStep` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProjectStep" DROP CONSTRAINT "ProjectStep_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectStep" DROP CONSTRAINT "ProjectStep_userId_fkey";

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "dueAt" DROP NOT NULL;

-- DropTable
DROP TABLE "ProjectStep";

-- DropEnum
DROP TYPE "ProjectStepAction";

-- CreateTable
CREATE TABLE "BaseModel" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "BaseModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GridStep" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "data" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "projectPortfolioId" TEXT NOT NULL,

    CONSTRAINT "GridStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EngineeringNotebookStep" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "page" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "projectPortfolioId" TEXT NOT NULL,

    CONSTRAINT "EngineeringNotebookStep_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GridStep_userId_idx" ON "GridStep"("userId");

-- CreateIndex
CREATE INDEX "EngineeringNotebookStep_userId_idx" ON "EngineeringNotebookStep"("userId");

-- AddForeignKey
ALTER TABLE "GridStep" ADD CONSTRAINT "GridStep_projectPortfolioId_fkey" FOREIGN KEY ("projectPortfolioId") REFERENCES "ProjectPortfolio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GridStep" ADD CONSTRAINT "GridStep_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EngineeringNotebookStep" ADD CONSTRAINT "EngineeringNotebookStep_projectPortfolioId_fkey" FOREIGN KEY ("projectPortfolioId") REFERENCES "ProjectPortfolio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EngineeringNotebookStep" ADD CONSTRAINT "EngineeringNotebookStep_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
