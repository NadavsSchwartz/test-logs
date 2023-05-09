/*
  Warnings:

  - A unique constraint covering the columns `[studentId]` on the table `Portfolio` will be added. If there are existing duplicate values, this will fail.
  - Made the column `studentId` on table `Portfolio` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Portfolio" DROP CONSTRAINT "Portfolio_studentId_fkey";

-- AlterTable
ALTER TABLE "Portfolio" ALTER COLUMN "studentId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Portfolio_studentId_key" ON "Portfolio"("studentId");

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
