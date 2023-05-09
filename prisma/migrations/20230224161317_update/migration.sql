-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_projectSetId_fkey";

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "projectSetId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_projectSetId_fkey" FOREIGN KEY ("projectSetId") REFERENCES "ProjectSet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
