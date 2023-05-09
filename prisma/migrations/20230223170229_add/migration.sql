/*
  Warnings:

  - Made the column `createdBy` on table `Classroom` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Classroom" DROP CONSTRAINT "Classroom_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_classroomId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_groupId_fkey";

-- AlterTable
ALTER TABLE "Classroom" ALTER COLUMN "createdBy" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Classroom" ADD CONSTRAINT "Classroom_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
