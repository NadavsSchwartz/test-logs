/**
 * create group data
 */

import { Assignment, Group, User } from '@prisma/client';

// **
// * create group with members
// */
export type Groups = Group[];
export interface GroupWithStudents extends Partial<Group> {
  students:
    | {
        id: string;
        firstName: string;
        lastName: string;
      }[]
    | [];
  isEditing?: boolean;
}

export type GroupCreateFormData = {
  members: {
    id: string;
  }[];
  classroomId: string;
  displayName: string;
  teacherId: string;
};

export type GroupCreateData = {
  displayName: string;
  classroomId: string;
  createdBy: string;
  groupSetId: string;
};
export type GroupServicesCreateData = {
  displayName: string;
  createdBy: string;
  groupSetId: string;
};
export type GroupWithMemebers = Group & {
  members: {
    id: string;
    firstName: string;
    lastName: string;
  }[];
};

export type GroupWithMemebersForActiveClassroom = Group & {
  members: {
    id: string;
    userId: string;
    groupId: string;
    createdAt: Date;
  }[];
};

export type MembersOfGroup = {
  id: string;
  firstName: string;
  lastName: string;
};
export type GroupsWithAssignmentsAndStudents = {
  groups: Partial<Group> &
    {
      assignments: Assignment[];
      students: Partial<User>[];
    }[];
  unassignedStudents?: Partial<User>[] | [];
};
