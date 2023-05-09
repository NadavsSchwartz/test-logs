/*
  Warnings:

  - The values [BORED,ELATED] on the enum `FeelingType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `boardState` on the `AssignmentState` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(5000)`.
  - You are about to drop the column `createdBy` on the `FeelingsTracker` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `Kudo` table. All the data in the column will be lost.
  - Made the column `displayName` on table `Classroom` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `studentId` to the `FeelingsTracker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FeelingType_new" AS ENUM ('HAPPY', 'CALM', 'FOCUSED', 'READYTOLEARN', 'SAD', 'SICK', 'WITHDRAWN', 'TIRED', 'FRUSTRATED', 'WORRIED', 'SILLY', 'EXCITED', 'MAD', 'TERRIFIED', 'YELLING', 'FURIOUS');
ALTER TABLE "FeelingsTracker" ALTER COLUMN "type" TYPE "FeelingType_new" USING ("type"::text::"FeelingType_new");
ALTER TYPE "FeelingType" RENAME TO "FeelingType_old";
ALTER TYPE "FeelingType_new" RENAME TO "FeelingType";
DROP TYPE "FeelingType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "FeelingsTracker" DROP CONSTRAINT "FeelingsTracker_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "Kudo" DROP CONSTRAINT "Kudo_createdBy_fkey";

-- AlterTable
ALTER TABLE "AssignmentState" ALTER COLUMN "boardState" SET DATA TYPE VARCHAR(5000);

-- AlterTable
ALTER TABLE "Classroom" ALTER COLUMN "displayName" SET NOT NULL;

-- AlterTable
ALTER TABLE "EngineeringNotebookStep" ADD COLUMN     "iteration" INTEGER NOT NULL DEFAULT 1,
ALTER COLUMN "portfolioId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "FeelingsTracker" DROP COLUMN "createdBy",
ADD COLUMN     "portfolioId" TEXT,
ADD COLUMN     "studentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Kudo" DROP COLUMN "createdBy",
ADD COLUMN     "portfolioId" TEXT;

-- AddForeignKey
ALTER TABLE "Kudo" ADD CONSTRAINT "Kudo_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kudo" ADD CONSTRAINT "Kudo_toId_fkey" FOREIGN KEY ("toId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kudo" ADD CONSTRAINT "Kudo_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeelingsTracker" ADD CONSTRAINT "FeelingsTracker_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeelingsTracker" ADD CONSTRAINT "FeelingsTracker_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE SET NULL ON UPDATE CASCADE;
