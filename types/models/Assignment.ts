import {
  Assignment,
  FeelingType,
  Grade,
  KudosType,
  Tasks,
} from '@prisma/client';
import { ClientUser } from './User';

// --------- Request types ----------
// used in mutations and api arguments

/**
 * Assignment with user without password
 */
export type AssignmentithTeacher = Assignment & {
  teacher: ClientUser;
};

/**
 * Active/ inactive assignments
 */

export type TeachersAssignments = {
  activeAssignments: Assignment[] | [];
  inactiveAssignments: Assignment[] | [];
};
/**
 * create Assignment data
 */
export type AssignmentCreateData = Pick<
  Assignment,
  'displayName' | 'dueAt' | 'createdBy' | 'classroomId'
> & {
  groupSetId: string;
  taskId: string;
};

export type AssignmentUpdateFormData = Pick<
  Assignment,
  | 'displayName'
  | 'educatorDescription'
  | 'notebookDescription'
  | 'unit'
  | 'dueAt'
  | 'grade'
  | 'createdBy'
  | 'classroomId'
>;

export type AssignmentCreateFormData = {
  notebookDescription: string;
  displayName: string;
  groupSetId: string;
  taskId: string;
  dueAt: Date;
  unit: string;
  grade: string;
  createdBy: string;
};

// --------- Query params request types ----------
// used in queries and api args validation

export type AssignmentGetData = {
  teacherId: string;
};

// ---------  Tasks types ----------
/**
 * create Task data
 */

// don't put id in form, validation needs to diff on client and server
// id is in route param
export type TaskUpdateFormData = {
  notebookDescription: string;
  educatorDescription: string;
  displayName: string;
  unit: string;
  dueAt: Date;
  grade: Grade;
};

// update Task service on server
export type TaskUpdateServiceData = Partial<{
  notebookDescription: string;
  educatorDescription: string;
  displayName: string;
  unit: string;
  dueAt: Date;
  grade: Grade;
}>;

export type TaskCreateData = Pick<
  Tasks,
  | 'displayName'
  | 'notebookDescription'
  | 'unit'
  | 'grade'
  | 'createdBy'
  | 'notebookSummary'
  | 'type'
>;

export type TasksCreateFormData = {
  notebookDescription: string;
  displayName: string;
  unit: string;
  grade: Grade;
  createdBy: string;
  notebookSummary: string;
};

// don't put id in form, validation needs to diff on client and server
// id is in route param
export type TasksUpdateFormData = {
  notebookDescription: string;
  displayName: string;
  unit: string;
  grade: Grade;
};

// update Task service on server
export type TasksUpdateServiceData = Partial<{
  notebookDescription: string;
  educatorDescription: string;
  displayName: string;
  unit: string;
  dueAt: Date;
  grade: Grade;
}>;

export type AssignmentWithGroupSetId = {
  assignment: Assignment;
  groupSetId: string;
}[][];

export type AssignmentSetPageData = {
  id: string;
  classroom: { displayName: string } | null;
  assignment:
    | {
        active: boolean;
        id: string;
        displayName: string;
        educatorDescription: string;
        grade: Grade | null;
        unit: string;
        dueAt: Date;
        roomKey: string;
        group: {
          displayName: string;
          id: string;
          students: {
            id: string;
            firstName: string;
            lastName: string;
            email: string | null;
          }[];
        };
      }[]
    | null;
} | null;

export type AssignmentSetLogData = {
  id: string;
  displayName: string;
  group: {
    id: string;
    displayName: string;
    students: {
      id: string;
      firstName: string;
      lastName: string;
    }[];
  };
  engineeringNotebookSteps: {
    id: string;
    createdAt: Date;
    data: string;
    action: string;
    iteration: number;
    field: string;
    page: string;
    student: {
      id: string;
      firstName: string;
      lastName: string;
    };
  }[];
  feelingsTracker: {
    id: string;
    type: FeelingType;
    createdAt: Date;
    student: {
      id: string;
      firstName: string;
      lastName: string;
    };
  }[];
  kudos: {
    id: string;
    createdAt: Date;
    type: KudosType;
    isPositive: boolean;
    sender: {
      id: string;
      firstName: string;
      lastName: string;
    };
    receiver: {
      id: string;
      firstName: string;
      lastName: string;
    };
  }[];
}[];
