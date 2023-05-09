/*
  Warnings:

  - You are about to drop the column `template` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "template";

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "projectTemplateId" TEXT;

-- CreateTable
CREATE TABLE "ProjectTemplate" (
    "id" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "grade" "Grade",
    "notebookDescription" TEXT,

    CONSTRAINT "ProjectTemplate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_projectTemplateId_fkey" FOREIGN KEY ("projectTemplateId") REFERENCES "ProjectTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
