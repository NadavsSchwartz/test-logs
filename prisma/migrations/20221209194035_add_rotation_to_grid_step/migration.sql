/*
  Warnings:

  - Added the required column `rotation` to the `GridStep` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GridStep" ADD COLUMN     "rotation" INTEGER NOT NULL;
