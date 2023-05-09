/*
  Warnings:

  - You are about to drop the column `action` on the `GridStep` table. All the data in the column will be lost.
  - You are about to drop the column `attributes` on the `GridStep` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `GridStep` table. All the data in the column will be lost.
  - You are about to drop the column `rotation` on the `GridStep` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `GridStep` table. All the data in the column will be lost.
  - Added the required column `added` to the `GridStep` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tileType` to the `GridStep` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tileVariant` to the `GridStep` table without a default value. This is not possible if the table is not empty.
  - Added the required column `xPosition` to the `GridStep` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yPosition` to the `GridStep` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EngineeringNotebookStep" DROP CONSTRAINT "EngineeringNotebookStep_portfolioId_fkey";

-- DropForeignKey
ALTER TABLE "EngineeringNotebookStep" DROP CONSTRAINT "EngineeringNotebookStep_studentId_fkey";

-- DropForeignKey
ALTER TABLE "GridStep" DROP CONSTRAINT "GridStep_portfolioId_fkey";

-- DropForeignKey
ALTER TABLE "GridStep" DROP CONSTRAINT "GridStep_studentId_fkey";

-- AlterTable
ALTER TABLE "GridStep" DROP COLUMN "action",
DROP COLUMN "attributes",
DROP COLUMN "position",
DROP COLUMN "rotation",
DROP COLUMN "type",
ADD COLUMN     "added" BOOLEAN NOT NULL,
ADD COLUMN     "tileType" TEXT NOT NULL,
ADD COLUMN     "tileVariant" INTEGER NOT NULL,
ADD COLUMN     "xPosition" INTEGER NOT NULL,
ADD COLUMN     "yPosition" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "GridStep" ADD CONSTRAINT "GridStep_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GridStep" ADD CONSTRAINT "GridStep_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EngineeringNotebookStep" ADD CONSTRAINT "EngineeringNotebookStep_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EngineeringNotebookStep" ADD CONSTRAINT "EngineeringNotebookStep_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
