-- CreateEnum
CREATE TYPE "FeelingType" AS ENUM ('HAPPY', 'CALM', 'FOCUSED', 'READYTOLEARN', 'SAD', 'SICK', 'BORED', 'TIRED', 'FRUSTRATED', 'WORRIED', 'SILLY', 'EXCITED', 'MAD', 'TERRIFIED', 'YELLING', 'ELATED');

-- CreateEnum
CREATE TYPE "KudosType" AS ENUM ('TEAMWORK', 'EFFORT', 'COMMUNICATION');

-- CreateTable
CREATE TABLE "Kudos" (
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

    CONSTRAINT "Kudos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeelingsTracker" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT,
    "feelingsTracker" "FeelingType" NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "FeelingsTracker_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Kudos" ADD CONSTRAINT "Kudos_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kudos" ADD CONSTRAINT "Kudos_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeelingsTracker" ADD CONSTRAINT "FeelingsTracker_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeelingsTracker" ADD CONSTRAINT "FeelingsTracker_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
