/*
  Warnings:

  - Made the column `projectId` on table `Portfolio` required. This step will fail if there are existing NULL values in that column.
  - Made the column `submitted` on table `Portfolio` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Portfolio" ALTER COLUMN "projectId" SET NOT NULL,
ALTER COLUMN "submitted" SET NOT NULL;
