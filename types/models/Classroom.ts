import { Assignment, Classroom, Grade, GroupSet } from '@prisma/client';
import { ClientUser } from './User';

// --------- Request types ----------
// used in mutations and api arguments

/**
 * classroom with user without password
 */
export type ClassroomWithTeacher = Classroom & {
  teacher: ClientUser;
};
/**
 * classroom with members and assignments
 */
export type ClassroomWithMembersAndAssignments = Classroom & {
  members: ClientUser[];
  assignments: Assignment[];
};
/**
 * classroom groups
 */
export type ClassroomGroupSets = GroupSet[];
/**
 * Active/ inactive classrooms
 */

export type TeachersClassrooms = {
  activeClassrooms: Classroom[] | [];
  inactiveClassrooms: Classroom[] | [];
};
/**
 * create classroom data
 */
export type ClassroomCreateData = Pick<
  Classroom,
  | 'nickname'
  | 'description'
  | 'displayName'
  | 'startDate'
  | 'endDate'
  | 'grade'
  | 'createdBy'
  | 'teacherId'
>;

export type ClassroomCreateFormData = {
  nickname: string;
  description: string;
  displayName: string;
  teacherId: string;
  startDate: Date;
  endDate: Date;
  grade: Grade;
  createdBy: string;
};

// don't put id in form, validation needs to diff on client and server
// id is in route param
export type ClassroomUpdateFormData = {
  nickname: string;
  description: string;
  displayName: string;
  endDate: Date;
  grade: Grade;
};

// updateClassroom service on server
export type ClassroomUpdateServiceData = Partial<{
  nickname: string;
  description: string;
  displayName: string;
  startDate: Date;
  endDate: Date;
  grade: Grade;
}>;

// --------- Query params request types ----------
// used in queries and api args validation

export type ClassroomGetData = {
  teacherId: string;
};
