/*
  Warnings:

  - You are about to drop the column `createdBy` on the `ProjectSet` table. All the data in the column will be lost.
  - You are about to drop the column `displayName` on the `ProjectSet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProjectSet" DROP COLUMN "createdBy",
DROP COLUMN "displayName";
