-- DropForeignKey
ALTER TABLE "EngineeringNotebookStep" DROP CONSTRAINT "EngineeringNotebookStep_portfolioId_fkey";

-- DropForeignKey
ALTER TABLE "Portfolio" DROP CONSTRAINT "Portfolio_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Portfolio" DROP CONSTRAINT "Portfolio_studentId_fkey";

-- AlterTable
ALTER TABLE "EngineeringNotebookStep" ALTER COLUMN "portfolioId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Portfolio" ALTER COLUMN "projectId" DROP NOT NULL,
ALTER COLUMN "studentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "EngineeringNotebookStep" ADD CONSTRAINT "EngineeringNotebookStep_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
