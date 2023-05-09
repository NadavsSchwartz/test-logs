/*
  Warnings:

  - The `grade` column on the `Classroom` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `tags` on the `Project` table. All the data in the column will be lost.
  - Added the required column `subject` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Grade" AS ENUM ('K', 'FIRST', 'SECOND', 'THIRD', 'FOURTH', 'FIFTH', 'SIXTH', 'SEVENTH', 'EIGHTH', 'NINTH', 'TENTH', 'ELEVENTH', 'TWELFTH');

-- AlterTable
ALTER TABLE "Classroom" ADD COLUMN     "description" TEXT,
ADD COLUMN     "nickname" TEXT,
DROP COLUMN "grade",
ADD COLUMN     "grade" "Grade";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "tags",
ADD COLUMN     "grade" "Grade",
ADD COLUMN     "subject" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "projectId" TEXT;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
