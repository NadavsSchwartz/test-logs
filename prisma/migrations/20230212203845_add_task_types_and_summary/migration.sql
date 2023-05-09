-- CreateEnum
CREATE TYPE "TasksType" AS ENUM ('CHALLENGE_SET', 'CREATE_SPACE');

-- AlterTable
ALTER TABLE "Tasks" ADD COLUMN     "notebookSummary" TEXT,
ADD COLUMN     "type" "TasksType" NOT NULL DEFAULT 'CREATE_SPACE';
