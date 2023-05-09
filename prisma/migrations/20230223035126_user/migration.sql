/*
  Warnings:

  - Made the column `userId` on table `Portfolio` required. This step will fail if there are existing NULL values in that column.
  - Made the column `classroomId` on table `Project` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Portfolio" DROP CONSTRAINT "Portfolio_userId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_classroomId_fkey";

-- AlterTable
ALTER TABLE "Portfolio" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "classroomId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
