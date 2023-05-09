/*
  Warnings:

  - You are about to drop the column `projectIds` on the `ProjectSet` table. All the data in the column will be lost.
  - You are about to drop the column `groupIds` on the `ProjectSet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProjectSet" DROP COLUMN "projectIds",
DROP COLUMN "groupIds";
