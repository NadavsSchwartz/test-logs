/*
  Warnings:

  - The values [NINTH,TENTH,ELEVENTH,TWELFTH] on the enum `Grade` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `NotebookDescription` on the `Project` table. All the data in the column will be lost.
  - Made the column `endDate` on table `Classroom` required. This step will fail if there are existing NULL values in that column.
  - Made the column `startDate` on table `Classroom` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdBy` on table `Project` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Grade_new" AS ENUM ('K', 'FIRST', 'SECOND', 'THIRD', 'FOURTH', 'FIFTH', 'SIXTH', 'SEVENTH', 'EIGHTH');
ALTER TABLE "Classroom" ALTER COLUMN "grade" TYPE "Grade_new" USING ("grade"::text::"Grade_new");
ALTER TABLE "Project" ALTER COLUMN "grade" TYPE "Grade_new" USING ("grade"::text::"Grade_new");
ALTER TYPE "Grade" RENAME TO "Grade_old";
ALTER TYPE "Grade_new" RENAME TO "Grade";
DROP TYPE "Grade_old";
COMMIT;

-- AlterTable
ALTER TABLE "Classroom" ALTER COLUMN "endDate" SET NOT NULL,
ALTER COLUMN "startDate" SET NOT NULL;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "NotebookDescription",
ADD COLUMN     "notebookDescription" TEXT,
ALTER COLUMN "createdBy" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "gender" TEXT,
ALTER COLUMN "createdBy" SET DATA TYPE TEXT,
ALTER COLUMN "updatedBy" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "GroupMembership" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "GroupMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT,
    "displayName" TEXT,
    "classroomId" TEXT NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GroupMembership" ADD CONSTRAINT "GroupMembership_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMembership" ADD CONSTRAINT "GroupMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
