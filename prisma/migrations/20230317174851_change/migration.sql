/*
  Warnings:

  - You are about to drop the `Kudos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Kudos" DROP CONSTRAINT "Kudos_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "Kudos" DROP CONSTRAINT "Kudos_projectId_fkey";

-- DropTable
DROP TABLE "Kudos";

-- CreateTable
CREATE TABLE "Kudo" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT,
    "displayName" TEXT NOT NULL,
    "type" "KudosType" NOT NULL,
    "isPositive" BOOLEAN NOT NULL,
    "projectId" TEXT NOT NULL,
    "fromId" TEXT NOT NULL,
    "toId" TEXT NOT NULL,

    CONSTRAINT "Kudo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Kudo" ADD CONSTRAINT "Kudo_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kudo" ADD CONSTRAINT "Kudo_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
