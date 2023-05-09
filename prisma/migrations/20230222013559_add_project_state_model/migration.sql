/*
  Warnings:

  - You are about to drop the `_ProjectToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ProjectToUser" DROP CONSTRAINT "_ProjectToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectToUser" DROP CONSTRAINT "_ProjectToUser_B_fkey";

-- AlterTable
ALTER TABLE "ClassroomMembership" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "GridStep" ADD COLUMN     "rotation" TEXT;

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "active" SET DEFAULT true;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "verificationToken" DROP DEFAULT;

-- DropTable
DROP TABLE "_ProjectToUser";

-- CreateTable
CREATE TABLE "ProjectState" (
    "id" TEXT NOT NULL,
    "boardState" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectState_projectId_key" ON "ProjectState"("projectId");

-- CreateIndex
CREATE INDEX "ProjectState_projectId_idx" ON "ProjectState"("projectId");

-- CreateIndex
CREATE INDEX "Classroom_teacherId_idx" ON "Classroom"("teacherId");

-- CreateIndex
CREATE INDEX "GroupSet_classroomId_idx" ON "GroupSet"("classroomId");

-- CreateIndex
CREATE INDEX "Project_classroomId_idx" ON "Project"("classroomId");

-- AddForeignKey
ALTER TABLE "ProjectState" ADD CONSTRAINT "ProjectState_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
