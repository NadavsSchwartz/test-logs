const QueryKeys = {
  USER: 'user',
  ME: 'me',
  USERS: 'users',
  CLASSROOMS_HOME: 'classrooms-home',
  CLASSROOM: 'classroom',
  CLASSROOMS: 'classrooms',
  CLASSROOM_GROUPSETS: 'classroom-groupsets',
  GROUP: 'group',
  ASSIGNMENTS: 'assignments',
  ASSIGNMENT_DETAILS: 'assignment-details',
  ASSIGNMENT_LOG: 'assignment-log',
  ASSIGNMENTS_HOME: 'assignments-home',
  TASKS_HOME: 'tasks-home',
  TASKS: 'tasks',
  TASK: 'task',
  ACTIVE_ASSIGNMENTS: 'active-assignments',
  INACTIVE_ASSIGNMENTS: 'inactive-assignments',
  CLASSROOM_MEMBERS: 'classroom-members',
  CLASSSROOM_STUDENT_MANAGEMENT: 'classroom-student-management',
  ASSIGNMENTS_BY_STUDENT: 'assignments-by-student',
} as const;

export type QueryKeysType = (typeof QueryKeys)[keyof typeof QueryKeys];

export const filterEmptyKeys = (
  queryKey: Array<string | number | undefined | null>
) => {
  return queryKey.filter((item) => item || item === 0) as Array<
    string | number
  >;
};

export default QueryKeys;
