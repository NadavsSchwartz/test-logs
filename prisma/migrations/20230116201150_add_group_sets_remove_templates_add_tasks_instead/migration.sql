/*
  Warnings:

  - You are about to drop the column `classroomId` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `Portfolio` table. All the data in the column will be lost.
  - You are about to drop the column `projectTemplateId` on the `Tag` table. All the data in the column will be lost.
  - You are about to drop the `GroupMembership` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectTemplate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProjectToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Group" DROP CONSTRAINT "Group_classroomId_fkey";

-- DropForeignKey
ALTER TABLE "GroupMembership" DROP CONSTRAINT "GroupMembership_groupId_fkey";

-- DropForeignKey
ALTER TABLE "GroupMembership" DROP CONSTRAINT "GroupMembership_userId_fkey";

-- DropForeignKey
ALTER TABLE "Portfolio" DROP CONSTRAINT "Portfolio_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Portfolio" DROP CONSTRAINT "Portfolio_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_projectTemplateId_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectToUser" DROP CONSTRAINT "_ProjectToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectToUser" DROP CONSTRAINT "_ProjectToUser_B_fkey";

-- AlterTable
ALTER TABLE "Group" DROP COLUMN "classroomId",
ADD COLUMN     "groupSetId" TEXT;

-- AlterTable
ALTER TABLE "Portfolio" DROP COLUMN "studentId",
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "groupId" TEXT,
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "projectTemplateId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "groupId" TEXT;

-- DropTable
DROP TABLE "GroupMembership";

-- DropTable
DROP TABLE "ProjectTemplate";

-- DropTable
DROP TABLE "_ProjectToUser";

-- CreateTable
CREATE TABLE "GroupSet" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "classroomId" TEXT,

    CONSTRAINT "GroupSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tasks" (
    "id" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "grade" "Grade",
    "notebookDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "Tasks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Portfolio_projectId_idx" ON "Portfolio"("projectId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupSet" ADD CONSTRAINT "GroupSet_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_groupSetId_fkey" FOREIGN KEY ("groupSetId") REFERENCES "GroupSet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
