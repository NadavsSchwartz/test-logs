-- DropIndex
DROP INDEX "User_verificationToken_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "verificationToken" DROP NOT NULL;
