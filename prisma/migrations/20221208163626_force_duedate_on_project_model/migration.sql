/*
  Warnings:

  - Made the column `dueAt` on table `Project` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ClassroomMembership" ALTER COLUMN "classroomId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "dueAt" SET NOT NULL;
