/*
  Warnings:

  - Added the required column `groupId` to the `ProjectSet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectId` to the `ProjectSet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProjectSet" ADD COLUMN     "groupId" TEXT NOT NULL,
ADD COLUMN     "projectId" TEXT NOT NULL;
