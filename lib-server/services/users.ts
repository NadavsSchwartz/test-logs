import { WEBAPP_URL } from '@/lib/constants';
import { defaultAvatarSrc } from '@/lib/defaultAvatar';
import ApiError from '@lib-server/error';
import prisma, { excludeFromUser } from '@lib-server/prisma';
import { User } from '@prisma/client';
import { compare, hash } from 'bcryptjs';
import { GetSessionParams, getSession } from 'next-auth/react';
import {
  ClientUser,
  UserCreateData,
  UserGetData,
  UserUpdateServiceData,
} from 'types/models/User';

/**
 *
 * @returns null on fail, doesn't throw exception, user is not logged in
 *
 */
export const getMe = async (
  params: GetSessionParams
): Promise<Partial<ClientUser> | null> => {
  const session = await getSession(params);
  const id = session?.user?.id;

  if (!id) return null;

  const me = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      active: true,
      createdAt: true,
      gender: true,
      emailVerified: true,
    },
  });

  if (!me) return null;

  return me;
};

// -------- pages/api/users/[id].ts

export const getUser = async (id: string): Promise<ClientUser | null> => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) return null;
  const { email } = user;
  if (!email) {
    return null;
  }
  const rawImage = user.image;
  // This helps to prevent reaching the 4MB payload limit by avoiding base64 and instead passing the image url
  user.image = rawImage
    ? `${WEBAPP_URL}/api/users/avatar?email=${user.email}`
    : defaultAvatarSrc({ email });

  return excludeFromUser(user);
};

export const updateUser = async (
  id: string,
  userUpdateData: UserUpdateServiceData
): Promise<boolean> => {
  try {
    const { firstName, lastName, oldPassword, newPassword, image } =
      userUpdateData; // email reconfirm...
    if (!userUpdateData) throw new ApiError('No data provided', 400);
    // validate userId
    const _user = await prisma.user.findUnique({ where: { id } });
    if (!_user) throw new ApiError(`User with id: ${id} not found.`, 404);

    // validate password
    if (oldPassword && newPassword) {
      const isPasswordTheSame = oldPassword === newPassword;
      if (isPasswordTheSame)
        throw new ApiError(
          'New password can not be the same as old password',
          400
        );
      const valid = await compare(oldPassword, _user.password as string);
      if (!valid) throw new ApiError('Invalid old password.', 400);
    }
    const data = {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(image && { image }),
      ...(newPassword && { password: await hash(newPassword, 10) }),
    };

    const user = await prisma.user.update({
      where: { id },
      data,
    });
    if (!user) throw new ApiError('Update user failed.', 400);

    return true;
  } catch (error: any) {
    throw new ApiError(error.message, error.status || 500);
  }
};

export const deleteUser = async (id: string): Promise<ClientUser> => {
  // validate id
  const _user = await prisma.user.findUnique({ where: { id } });
  if (!_user) throw new ApiError('User not found.', 404);

  const user = await prisma.user.delete({ where: { id } });
  if (!user) throw new ApiError('Delete user failed.', 400);

  return excludeFromUser(user);
};

// -------- pages/api/users/

export const createUser = async (
  userCreateData: UserCreateData
): Promise<ClientUser> => {
  const { firstName, lastName, email, password: _password } = userCreateData;

  // unique email
  const _user1 = await prisma.user.findFirst({
    where: { email: email.toLowerCase().trim() },
  });
  if (_user1)
    throw new ApiError(`User with email: ${email} already exists.`, 409);

  const password = await hash(_password.trim(), 10);

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      role: 'TEACHER',
    },
  });

  if (!user) throw new ApiError('User cerate failed.', 400);

  return excludeFromUser(user);
};

export const verifyUser = async (token: string, id: string): Promise<User> => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new ApiError('User not found.', 404);

  if (user.active === true) throw new ApiError('User is already active.', 400);

  if (user.verificationToken !== token)
    throw new ApiError('Invalid verification token.', 400);

  const updateUser = await prisma.user.update({
    where: { id },
    data: {
      verificationToken: null,
      active: true,
      emailVerified: new Date().toISOString(),
    },
  });

  if (!updateUser) throw new ApiError('User verification failed.', 400);

  return updateUser;
};

// -------- pages/api/users/profile.ts

export const getUserByIdOrEmail = async (
  userGetData: UserGetData = {}
): Promise<ClientUser> => {
  const { id, email } = userGetData;

  const user = await prisma.user.findFirst({
    where: { OR: [{ id }, { email: email?.toLowerCase().trim() }] },
  });

  if (!user) throw new ApiError('User not found.', 404);

  return excludeFromUser(user);
};
