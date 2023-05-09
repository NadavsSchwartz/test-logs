/*
  Warnings:

  - Made the column `portfolioId` on table `EngineeringNotebookStep` required. This step will fail if there are existing NULL values in that column.
  - Made the column `projectId` on table `EngineeringNotebookStep` required. This step will fail if there are existing NULL values in that column.
  - Made the column `projectId` on table `GridStep` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "EngineeringNotebookStep" DROP CONSTRAINT "EngineeringNotebookStep_projectId_fkey";

-- DropForeignKey
ALTER TABLE "GridStep" DROP CONSTRAINT "GridStep_projectId_fkey";

-- AlterTable
ALTER TABLE "EngineeringNotebookStep" ALTER COLUMN "portfolioId" SET NOT NULL,
ALTER COLUMN "projectId" SET NOT NULL;

-- AlterTable
ALTER TABLE "GridStep" ALTER COLUMN "projectId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "GridStep" ADD CONSTRAINT "GridStep_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EngineeringNotebookStep" ADD CONSTRAINT "EngineeringNotebookStep_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
