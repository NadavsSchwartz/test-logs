/*
  Warnings:

  - A unique constraint covering the columns `[roomKey]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Project_roomKey_key" ON "Project"("roomKey");
