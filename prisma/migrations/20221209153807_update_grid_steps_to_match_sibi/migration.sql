/*
  Warnings:

  - You are about to drop the column `userId` on the `EngineeringNotebookStep` table. All the data in the column will be lost.
  - You are about to drop the column `data` on the `GridStep` table. All the data in the column will be lost.
  - You are about to drop the column `projectPortfolioId` on the `GridStep` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `GridStep` table. All the data in the column will be lost.
  - You are about to drop the column `x` on the `GridStep` table. All the data in the column will be lost.
  - You are about to drop the column `y` on the `GridStep` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Portfolio` table. All the data in the column will be lost.
  - Added the required column `studentId` to the `EngineeringNotebookStep` table without a default value. This is not possible if the table is not empty.
  - Added the required column `attributes` to the `GridStep` table without a default value. This is not possible if the table is not empty.
  - Added the required column `portfolioId` to the `GridStep` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position` to the `GridStep` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `GridStep` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `GridStep` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `Portfolio` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EngineeringNotebookStep" DROP CONSTRAINT "EngineeringNotebookStep_userId_fkey";

-- DropForeignKey
ALTER TABLE "GridStep" DROP CONSTRAINT "GridStep_projectPortfolioId_fkey";

-- DropForeignKey
ALTER TABLE "GridStep" DROP CONSTRAINT "GridStep_userId_fkey";

-- DropIndex
DROP INDEX "Portfolio_projectId_key";

-- AlterTable
ALTER TABLE "EngineeringNotebookStep" DROP COLUMN "userId",
ADD COLUMN     "studentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "GridStep" DROP COLUMN "data",
DROP COLUMN "projectPortfolioId",
DROP COLUMN "userId",
DROP COLUMN "x",
DROP COLUMN "y",
ADD COLUMN     "attributes" JSONB NOT NULL,
ADD COLUMN     "portfolioId" TEXT NOT NULL,
ADD COLUMN     "position" JSONB NOT NULL,
ADD COLUMN     "studentId" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Portfolio" DROP COLUMN "userId",
ADD COLUMN     "studentId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "GridStep" ADD CONSTRAINT "GridStep_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GridStep" ADD CONSTRAINT "GridStep_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EngineeringNotebookStep" ADD CONSTRAINT "EngineeringNotebookStep_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
