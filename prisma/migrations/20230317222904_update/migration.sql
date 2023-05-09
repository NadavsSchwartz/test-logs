/*
  Warnings:

  - You are about to drop the column `feelingsTracker` on the `FeelingsTracker` table. All the data in the column will be lost.
  - Added the required column `type` to the `FeelingsTracker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FeelingsTracker" DROP COLUMN "feelingsTracker",
ADD COLUMN     "type" "FeelingType" NOT NULL;
