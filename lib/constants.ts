const VERCEL_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';
export const APP_NAME = 'Test log';
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export const BASE_URL =
  process.env.BASE_URL || `https://${process.env.VERCEL_URL}`;
export const WEBSITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://test.com';
export const NEXT_PUBLIC_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || `https://${process.env.VERCEL_URL}`;
export const WEBAPP_URL =
  NEXT_PUBLIC_BASE_URL || VERCEL_URL || 'http://localhost:3000';

export const Routes = {
  SITE: {
    HOME: '/',
    TEACHER_DASHBOARD: '/dashboard',
    STUDENT_DASHBOARD: '/dashboard',
    ADMIN_DASHBOARD: '/admin/dashboard',
    ADMIN_LIST_USERS: '/admin/users',
    ADMIN_PROFILE: '/profile/:adminId',
    TEACHER_PROFILE: '/profile/:teacherId',
    STUDENT_PROFILE: '/profile/:studentId',
    STUDENT_ASSIGNMENTS: '/assignments',
    STUDENT_ASSIGNMENT: '/assignment/:assignmentId',
    TEACHER_ROSTER: '/roster',
    TEACHER_CLASSROOMS: '/classrooms',
    TEACHER_CLASSROOM: '/classroom/:classroomId',
    TEACHER_CLASSROOM_GROUP: '/classroom/:classroomId/groups',
    TEACHER_CLASSROOM_ACTIVE: '/classroom/:classroomId/active',

    TEACHER_TASKS: '/tasks',
    REGISTER: '/auth/signup',
    LOGIN: '/auth/signin',
    RPOFILE: '/profile',
    USERS: '/users',
    _500: '/500',
    VERIFY_ACCOUNT: '/auth/verify-account',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password',
    LOGOUT: '/auth/logout',
    NOT_FOUND: '/404',
    LAUNCH_GAME: '/game/p?token=:token',
  },
  API: {
    USERS: '/api/users',
    STUDENTS: '/api/students',
    PROFILE: '/api/users/:id',
    SESSION: '/api/auth/session',
    CLASSROOMS: '/api/classrooms',
    ASSIGNMENTS: '/api/assignments',
    TASKS: '/api/tasks',
    RESET_PASSWORD: '/api/auth/reset-password',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    VERIFY_ACCOUNT: '/api/auth/verify-account',
    GROUPSETS: '/api/classrooms/:classroomId/groupsets',
    GROUPSET: '/api/classrooms/:classroomId/groupsets/:groupsetId',
    GROUP: '/api/classrooms/:classroomId/groups/:groupId',
    ACTIVE_ASSIGNMENTS: '/api/classrooms/:classroomId/active',
    INACTIVE_ASSIGNMENTS: '/api/classrooms/:classroomId/inactive',
    CLASSROOM_MEMBERS: '/api/classrooms/:classroomId/members',
  },
} as const;

// ----------- redirects getServerSideProps

export const Redirects = {
  NOT_FOUND: {
    redirect: {
      destination: Routes.SITE.NOT_FOUND,
      permanent: false,
    },
  },
  _500: {
    redirect: {
      permanent: false,
      destination: Routes.SITE._500,
    },
  },
  LOGIN: {
    redirect: {
      permanent: false,
      destination: Routes.SITE.LOGIN,
    },
  },
  HOME: {
    redirect: {
      permanent: false,
      destination: Routes.SITE.HOME,
    },
  },
  TEACHER_CLASSROOMS: {
    redirect: {
      permanent: false,
      destination: Routes.SITE.TEACHER_CLASSROOMS,
    },
  },
  TEACHER_CLASSROOM_ACTIVE_ASSIGNMENTS: {
    redirect: {
      permanent: false,
      destination: Routes.SITE.TEACHER_CLASSROOM_ACTIVE,
    },
  },
} as const;

// grades for dropdown
export const GRADES = [
  { value: 'K', label: 'K' },
  { value: 'FIRST', label: 'FIRST' },
  { value: 'SECOND', label: 'SECOND' },
  { value: 'THIRD', label: 'THIRD' },
  { value: 'FOURTH', label: 'FOURTH' },
  { value: 'FIFTH', label: 'FIFTH' },
  { value: 'SIXTH', label: 'SIXTH' },
  { value: 'SEVENTH', label: 'SEVENTH' },
  { value: 'EIGHTH', label: 'EIGHTH' },
  // { value: 'MULTIPLE', label: 'MULTIPLE' },
];

// Units for dropdown
export const UNITS = [
  { value: 'forces-and-motion', label: 'Forces and Motion' },
  { value: 'energy-and-circuits', label: 'Energy and Circuits' },
];
