-- DropForeignKey
ALTER TABLE "ClassroomMembership" DROP CONSTRAINT "ClassroomMembership_classroomId_fkey";

-- AddForeignKey
ALTER TABLE "ClassroomMembership" ADD CONSTRAINT "ClassroomMembership_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
