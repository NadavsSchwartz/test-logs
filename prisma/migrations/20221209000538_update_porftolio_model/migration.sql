/*
  Warnings:

  - Added the required column `type` to the `EngineeringNotebookStep` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EngineeringNotebookStep" ADD COLUMN     "type" TEXT NOT NULL;
