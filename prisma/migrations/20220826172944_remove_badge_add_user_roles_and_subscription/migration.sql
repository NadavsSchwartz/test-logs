/*
  Warnings:

  - You are about to drop the column `roles` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Badge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BadgeAward` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BadgeAwardedActivityFeedEntry` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UserRole" ADD VALUE 'COLLABORATOR';
ALTER TYPE "UserRole" ADD VALUE 'ADMIN';

-- DropForeignKey
ALTER TABLE "BadgeAward" DROP CONSTRAINT "BadgeAward_badgeId_fkey";

-- DropForeignKey
ALTER TABLE "BadgeAward" DROP CONSTRAINT "BadgeAward_portfolioId_fkey";

-- DropForeignKey
ALTER TABLE "BadgeAward" DROP CONSTRAINT "BadgeAward_userId_fkey";

-- DropForeignKey
ALTER TABLE "BadgeAwardedActivityFeedEntry" DROP CONSTRAINT "BadgeAwardedActivityFeedEntry_badgeAwardId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "roles",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'STUDENT';

-- DropTable
DROP TABLE "Badge";

-- DropTable
DROP TABLE "BadgeAward";

-- DropTable
DROP TABLE "BadgeAwardedActivityFeedEntry";

-- DropEnum
DROP TYPE "BadgeAwardType";

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trialPeriodStartDate" TIMESTAMP(3),
    "trialPeriodEndDate" TIMESTAMP(3),
    "subscribeAfterTrial" BOOLEAN,
    "currentPlanId" TEXT,
    "offerId" TEXT,
    "offerStartDate" TIMESTAMP(3),
    "offerEndDate" TIMESTAMP(3),
    "dateSubscribed" TIMESTAMP(3),
    "dateUnsubscribed" TIMESTAMP(3),
    "validUntil" TIMESTAMP(3),

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "price" TEXT,
    "currency" TEXT,
    "active" BOOLEAN,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanHistory" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "planId" TEXT,
    "subscriptionId" TEXT,
    "dateStart" TIMESTAMP(3),
    "dateEnd" TIMESTAMP(3),

    CONSTRAINT "PlanHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subscriptionId" TEXT,
    "planHistoryId" TEXT,
    "invoicePeriodStartDate" TIMESTAMP(3),
    "invoicePeriodEndDate" TIMESTAMP(3),
    "invoiceDescription" TEXT,
    "invoiceAmount" TEXT,
    "invoiceCurrency" TEXT,
    "invoiceStatus" TEXT,
    "invoiceDue" TIMESTAMP(3),

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Offer" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "description" TEXT,
    "discountAmount" TEXT,
    "discountPercentage" TEXT,
    "durationInMonths" TEXT,
    "durationEndDate" TIMESTAMP(3),

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_currentPlanId_fkey" FOREIGN KEY ("currentPlanId") REFERENCES "Plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanHistory" ADD CONSTRAINT "PlanHistory_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanHistory" ADD CONSTRAINT "PlanHistory_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_planHistoryId_fkey" FOREIGN KEY ("planHistoryId") REFERENCES "PlanHistory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
