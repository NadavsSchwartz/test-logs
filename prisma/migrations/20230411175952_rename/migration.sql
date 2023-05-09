/*
  Warnings:

  - You are about to drop the column `projectId` on the `EngineeringNotebookStep` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `FeelingsTracker` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `GridStep` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `Kudo` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `Portfolio` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `Tag` table. All the data in the column will be lost.
  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectSet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectState` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `assignmentId` to the `EngineeringNotebookStep` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assignmentId` to the `FeelingsTracker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assignmentId` to the `GridStep` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assignmentId` to the `Kudo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assignmentId` to the `Portfolio` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EngineeringNotebookStep" DROP CONSTRAINT "EngineeringNotebookStep_projectId_fkey";

-- DropForeignKey
ALTER TABLE "FeelingsTracker" DROP CONSTRAINT "FeelingsTracker_projectId_fkey";

-- DropForeignKey
ALTER TABLE "GridStep" DROP CONSTRAINT "GridStep_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Kudo" DROP CONSTRAINT "Kudo_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_classroomId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_groupId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_projectSetId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectSet" DROP CONSTRAINT "ProjectSet_classroomId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectState" DROP CONSTRAINT "ProjectState_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_projectId_fkey";

-- DropIndex
DROP INDEX "EngineeringNotebookStep_projectId_idx";

-- DropIndex
DROP INDEX "GridStep_projectId_idx";

-- DropIndex
DROP INDEX "Portfolio_projectId_idx";

-- AlterTable
ALTER TABLE "EngineeringNotebookStep" DROP COLUMN "projectId",
ADD COLUMN     "assignmentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FeelingsTracker" DROP COLUMN "projectId",
ADD COLUMN     "assignmentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "GridStep" DROP COLUMN "projectId",
ADD COLUMN     "assignmentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Kudo" DROP COLUMN "projectId",
ADD COLUMN     "assignmentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Portfolio" DROP COLUMN "projectId",
ADD COLUMN     "assignmentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "projectId",
ADD COLUMN     "assignmentId" TEXT;

-- DropTable
DROP TABLE "Project";

-- DropTable
DROP TABLE "ProjectSet";

-- DropTable
DROP TABLE "ProjectState";

-- CreateTable
CREATE TABLE "Assignment" (
    "id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "displayName" TEXT NOT NULL,
    "dueAt" TIMESTAMP(3) NOT NULL,
    "educatorDescription" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT,
    "roomKey" TEXT NOT NULL,
    "grade" "Grade",
    "unit" TEXT NOT NULL,
    "notebookDescription" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "classroomId" TEXT NOT NULL,
    "assignmentSetId" TEXT,

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignmentSet" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "classroomId" TEXT,

    CONSTRAINT "AssignmentSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignmentState" (
    "id" TEXT NOT NULL,
    "boardState" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssignmentState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Assignment_roomKey_key" ON "Assignment"("roomKey");

-- CreateIndex
CREATE INDEX "Assignment_classroomId_idx" ON "Assignment"("classroomId");

-- CreateIndex
CREATE INDEX "AssignmentSet_classroomId_idx" ON "AssignmentSet"("classroomId");

-- CreateIndex
CREATE UNIQUE INDEX "AssignmentState_assignmentId_key" ON "AssignmentState"("assignmentId");

-- CreateIndex
CREATE INDEX "AssignmentState_assignmentId_idx" ON "AssignmentState"("assignmentId");

-- CreateIndex
CREATE INDEX "EngineeringNotebookStep_assignmentId_idx" ON "EngineeringNotebookStep"("assignmentId");

-- CreateIndex
CREATE INDEX "GridStep_assignmentId_idx" ON "GridStep"("assignmentId");

-- CreateIndex
CREATE INDEX "Portfolio_assignmentId_idx" ON "Portfolio"("assignmentId");

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_assignmentSetId_fkey" FOREIGN KEY ("assignmentSetId") REFERENCES "AssignmentSet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentSet" ADD CONSTRAINT "AssignmentSet_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kudo" ADD CONSTRAINT "Kudo_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeelingsTracker" ADD CONSTRAINT "FeelingsTracker_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentState" ADD CONSTRAINT "AssignmentState_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GridStep" ADD CONSTRAINT "GridStep_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EngineeringNotebookStep" ADD CONSTRAINT "EngineeringNotebookStep_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
