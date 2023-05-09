-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "projectSetId" TEXT;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "projectSetId" TEXT;

-- CreateTable
CREATE TABLE "ProjectSet" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "projectIds" TEXT[],
    "groupIds" TEXT[],

    CONSTRAINT "ProjectSet_pkey" PRIMARY KEY ("id")
);
