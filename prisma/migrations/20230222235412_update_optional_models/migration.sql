/*
  Warnings:

  - You are about to drop the column `subject` on the `Project` table. All the data in the column will be lost.
  - Made the column `displayName` on table `GroupSet` required. This step will fail if there are existing NULL values in that column.
  - Made the column `displayName` on table `Project` required. This step will fail if there are existing NULL values in that column.
  - Made the column `notebookDescription` on table `Project` required. This step will fail if there are existing NULL values in that column.
  - Made the column `grade` on table `Tasks` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "GroupSet" ALTER COLUMN "displayName" SET NOT NULL;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "subject",
ADD COLUMN     "unit" TEXT,
ALTER COLUMN "displayName" SET NOT NULL,
ALTER COLUMN "notebookDescription" SET NOT NULL;

-- AlterTable
ALTER TABLE "Tasks" ALTER COLUMN "grade" SET NOT NULL;
