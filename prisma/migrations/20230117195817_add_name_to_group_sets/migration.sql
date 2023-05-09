-- AlterTable
ALTER TABLE "Group" ALTER COLUMN "createdBy" DROP NOT NULL;

-- AlterTable
ALTER TABLE "GroupSet" ADD COLUMN     "displayName" TEXT;
