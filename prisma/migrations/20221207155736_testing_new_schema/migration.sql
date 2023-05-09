/*
  Warnings:

  - You are about to drop the column `viewState` on the `ProjectPortfolio` table. All the data in the column will be lost.
  - You are about to drop the `TeamMembership` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TeamMembership" DROP CONSTRAINT "TeamMembership_teamId_fkey";

-- DropForeignKey
ALTER TABLE "TeamMembership" DROP CONSTRAINT "TeamMembership_userId_fkey";

-- AlterTable
ALTER TABLE "EngineeringNotebookStep" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "GridStep" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ProjectPortfolio" DROP COLUMN "viewState";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "teamId" TEXT;

-- DropTable
DROP TABLE "TeamMembership";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
