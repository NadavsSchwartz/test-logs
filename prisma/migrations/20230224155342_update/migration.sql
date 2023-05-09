/*
  Warnings:

  - You are about to drop the column `projectId` on the `ProjectSet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProjectSet" DROP COLUMN "projectId";

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_projectSetId_fkey" FOREIGN KEY ("projectSetId") REFERENCES "ProjectSet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
