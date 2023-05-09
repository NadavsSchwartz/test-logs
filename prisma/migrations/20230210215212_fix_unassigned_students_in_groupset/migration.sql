/*
  Warnings:

  - The `unassignedStudents` column on the `GroupSet` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "GroupSet" DROP COLUMN "unassignedStudents",
ADD COLUMN     "unassignedStudents" TEXT[] DEFAULT ARRAY[]::TEXT[];
