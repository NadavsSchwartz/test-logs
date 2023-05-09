-- CreateEnum
CREATE TYPE "ProjectStepAction" AS ENUM ('CHANGELOCATION', 'ADD', 'REMOVE');

-- CreateTable
CREATE TABLE "ProjectStep" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "data" TEXT NOT NULL,
    "action" "ProjectStepAction" NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "ProjectStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResetPasswordRequest" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResetPasswordRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProjectStep" ADD CONSTRAINT "ProjectStep_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectStep" ADD CONSTRAINT "ProjectStep_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
