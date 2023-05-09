/*
  Warnings:

  - Made the column `educatorDescription` on table `Project` required. This step will fail if there are existing NULL values in that column.
  - Made the column `roomKey` on table `Project` required. This step will fail if there are existing NULL values in that column.
  - Made the column `groupId` on table `Project` required. This step will fail if there are existing NULL values in that column.
  - Made the column `unit` on table `Project` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_groupId_fkey";

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "educatorDescription" SET NOT NULL,
ALTER COLUMN "roomKey" SET NOT NULL,
ALTER COLUMN "groupId" SET NOT NULL,
ALTER COLUMN "unit" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
