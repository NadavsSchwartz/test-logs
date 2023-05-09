/*
  Warnings:

  - You are about to drop the column `active` on the `ClassroomMembership` table. All the data in the column will be lost.
  - You are about to drop the column `appChallengeId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `originalProjectId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `studentDescription` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the `AuthorMetadata` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `teacherId` to the `Classroom` table without a default value. This is not possible if the table is not empty.
  - Made the column `classroomId` on table `ClassroomMembership` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Classroom" ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "grade" TEXT,
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "teacherId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ClassroomMembership" DROP COLUMN "active",
ALTER COLUMN "classroomId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "appChallengeId",
DROP COLUMN "originalProjectId",
DROP COLUMN "studentDescription",
ADD COLUMN     "NotebookDescription" TEXT,
ADD COLUMN     "classroomId" TEXT,
ALTER COLUMN "tags" SET DATA TYPE TEXT[];

-- DropTable
DROP TABLE "AuthorMetadata";

-- AddForeignKey
ALTER TABLE "Classroom" ADD CONSTRAINT "Classroom_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassroomMembership" ADD CONSTRAINT "ClassroomMembership_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE SET NULL ON UPDATE CASCADE;
