/*
  Warnings:

  - Made the column `displayName` on table `Group` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ClassroomMembership" DROP CONSTRAINT "ClassroomMembership_userId_fkey";

-- AlterTable
ALTER TABLE "Group" ALTER COLUMN "displayName" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "ClassroomMembership" ADD CONSTRAINT "ClassroomMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
