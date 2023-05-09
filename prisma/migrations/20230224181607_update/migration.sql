/*
  Warnings:

  - You are about to drop the column `projectSetId` on the `Group` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Group" DROP CONSTRAINT "Group_projectSetId_fkey";

-- AlterTable
ALTER TABLE "Group" DROP COLUMN "projectSetId";

-- AlterTable
ALTER TABLE "ProjectSet" ADD COLUMN     "classroomId" TEXT;

-- CreateIndex
CREATE INDEX "ProjectSet_classroomId_idx" ON "ProjectSet"("classroomId");

-- AddForeignKey
ALTER TABLE "ProjectSet" ADD CONSTRAINT "ProjectSet_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
