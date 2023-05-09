/*
  Warnings:

  - Added the required column `projectId` to the `EngineeringNotebookStep` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectId` to the `GridStep` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EngineeringNotebookStep" ADD COLUMN     "projectId" TEXT;

-- AlterTable
ALTER TABLE "GridStep" ADD COLUMN     "projectId" TEXT;

-- CreateIndex
CREATE INDEX "EngineeringNotebookStep_projectId_idx" ON "EngineeringNotebookStep"("projectId");

-- CreateIndex
CREATE INDEX "GridStep_projectId_idx" ON "GridStep"("projectId");

-- AddForeignKey
ALTER TABLE "GridStep" ADD CONSTRAINT "GridStep_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EngineeringNotebookStep" ADD CONSTRAINT "EngineeringNotebookStep_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
