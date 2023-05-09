/*
  Warnings:

  - You are about to drop the column `unassignedStudents` on the `GroupSet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GroupSet" DROP COLUMN "unassignedStudents";

-- CreateTable
CREATE TABLE "_GroupSetToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GroupSetToUser_AB_unique" ON "_GroupSetToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_GroupSetToUser_B_index" ON "_GroupSetToUser"("B");

-- AddForeignKey
ALTER TABLE "_GroupSetToUser" ADD CONSTRAINT "_GroupSetToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "GroupSet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupSetToUser" ADD CONSTRAINT "_GroupSetToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
