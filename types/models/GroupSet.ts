/**
 * create group set data
 */

import { Assignment, Classroom, Group, GroupSet, User } from '@prisma/client';

export type GroupSetWithGroupsAndAssignmentsAndStudents = GroupSet & {
  groups: Partial<Group> &
    {
      assignments: Assignment[];
      students: Partial<User>[];
    }[];
  unassignedStudents?: Partial<User>[] | [];
};
export type GroupSetWithGroups = GroupSet & {
  groups: Group[];
};
export type GroupSetWithUnassignedStudents = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  classroomId: string | null;
  displayName: string | null;
  unassignedStudents: Partial<User>[] | [];
  groups: (Group & { assignments: Assignment[] }[]) | [];
};

export type GroupSetWithGroupsAndClassroom = GroupSet & {
  groups: Group[];
  classroom?: Classroom;
};

export type GroupSetCreateFormData = {
  displayName: string;
  classroomId: string;
  createdBy: string;
};

export interface GroupSetForDragAndDrop extends GroupSet {
  groups: {
    id: string;
    assignments: Assignment[] | [];
    displayName: string;
    isEditing: boolean;
    students:
      | {
          id: string;
          firstName: string;
          lastName: string;
        }[]
      | [];
  }[];
  unassignedStudents: Partial<User>[];
}
export type GroupSetWithGroupsAndUnassignedStudents = {
  id: string;
  createdAt: string;
  createdBy: string;
  classroomId: string;
  displayName: string;
  updatedAt: string;
  groups: {
    id: string;
    assignments: Assignment[] | [];

    students:
      | {
          id: string;
          firstName: string;
          lastName: string;
        }[]
      | [];
  }[];
  unassignedStudents: Partial<User>[];
}[];
