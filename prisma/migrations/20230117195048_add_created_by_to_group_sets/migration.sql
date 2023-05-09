/*
  Warnings:

  - Added the required column `createdBy` to the `GroupSet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GroupSet" ADD COLUMN     "createdBy" TEXT NOT NULL;
