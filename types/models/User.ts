import { User } from '@prisma/client';
import { RequiredNotNull } from 'types';

// --------- Response types ----------
// used in queries and api responses

/**
 * user without password
 */
export type ClientUser = Omit<User, 'password'> & {
  // classrooms?: { id: string; displayName: string }[] | [];
  // classroomMembership?: { id: string; displayName: string }[] | [];
  userToken?: string;
};

// --------- Request types ----------
// used in mutations and api arguments

/**
 * create user, password is required
 */
export type UserCreateData = RequiredNotNull<
  Pick<User, 'lastName' | 'firstName' | 'email' | 'password'>
>;

export type UserCreateFormData = {
  email: string;
  password: string;
  confirmPassword?: string;
  firstName: string;
  lastName: string;
};

/**
 *  create student user
 */

export type StudentCreateData = RequiredNotNull<
  Pick<User, 'lastName' | 'firstName' | 'email' | 'role'>
>;

export type StudentCreateFormData = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword?: string;
  classroomId: string;
  teacherId: string;
  gender?: string;
};

export type StudentCreateViaCsvFileUpload = {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  gender: string;
  classroomId: string;
  teacherId: string;
}[];

/**
 * update user
 */
export type UserUpdateData = Partial<
  Omit<UserUpdateFormData, 'confirmPassword'>
>;

// for indexing with []
export type UserUpdateDataKeys = keyof UserUpdateData;

export type UserUpdateMutationData = {
  id: string;
  userData: UserUpdateData;
};

// don't put id in form, validation needs to diff on client and server
// id is in route param
export type UserUpdateFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  image: string;
};

// forgot password
export type UserForgotPasswordData = {
  email: string;
};

// reset password
export type UserResetPasswordData = {
  password: string;
  requestId: string;
  confirmPassword?: string;
};

// updateUser service on server
export type UserUpdateServiceData = Partial<{
  lastName: string;
  firstName: string;
  oldPassword: string;
  newPassword: string;
  image?: string;
}>;

// --------- Query params request types ----------
// used in queries and api args validation

export type UserGetData = Partial<{
  id: string;
  email: string;
}>;

// --------- NextAuth authorize() callback args types ----------

export type UserLoginData = {
  email: string;
  password: string;
};

// --------- classroom student management types ----------

export type ClassroomStudentManagement = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  gender: string | null;
};
