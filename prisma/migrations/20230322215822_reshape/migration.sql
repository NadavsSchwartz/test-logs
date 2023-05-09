-- DropForeignKey
ALTER TABLE "EngineeringNotebookStep" DROP CONSTRAINT "EngineeringNotebookStep_projectId_fkey";

-- DropForeignKey
ALTER TABLE "GridStep" DROP CONSTRAINT "GridStep_projectId_fkey";

-- AddForeignKey
ALTER TABLE "GridStep" ADD CONSTRAINT "GridStep_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EngineeringNotebookStep" ADD CONSTRAINT "EngineeringNotebookStep_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
