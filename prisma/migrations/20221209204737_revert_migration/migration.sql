-- DropForeignKey
ALTER TABLE "Portfolio" DROP CONSTRAINT "Portfolio_studentId_fkey";

-- DropIndex
DROP INDEX "Portfolio_studentId_key";

-- AlterTable
ALTER TABLE "Portfolio" ALTER COLUMN "studentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
