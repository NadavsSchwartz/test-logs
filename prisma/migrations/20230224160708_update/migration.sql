/*
  Warnings:

  - You are about to drop the column `groupId` on the `ProjectSet` table. All the data in the column will be lost.
  - Made the column `projectSetId` on table `Project` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_projectSetId_fkey";

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "projectSetId" SET NOT NULL;

-- AlterTable
ALTER TABLE "ProjectSet" DROP COLUMN "groupId";

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_projectSetId_fkey" FOREIGN KEY ("projectSetId") REFERENCES "ProjectSet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_projectSetId_fkey" FOREIGN KEY ("projectSetId") REFERENCES "ProjectSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
