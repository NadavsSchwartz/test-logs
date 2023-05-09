import ApiError from 'lib-server/error';
import { getMe } from 'lib-server/services/users';
import { NextApiRequest, NextApiResponse } from 'next';

type NextHandler = (err?: any) => void;

export const requireAuth = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  const me = await getMe({ req });

  // dont attach req.user because it complicates types
  const error = me?.id
    ? undefined
    : new ApiError('You are not logged in.', 401);
  next(error);
};

// todo: collide all requires into one middleware instead of 3 separate middlewares
export const requireAdmin = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  const me = await getMe({ req });
  const error =
    me?.role === 'ADMIN'
      ? undefined
      : new ApiError('You are not an admin.', 401);
  next(error);
};

export const requireTeacher = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  const me = await getMe({ req });
  const error =
    me?.role === 'TEACHER'
      ? undefined
      : new ApiError('You are not a teacher.', 401);
  next(error);
};

export const requireStudent = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  const me = await getMe({ req });
  const error =
    me?.role === 'STUDENT'
      ? undefined
      : new ApiError('You are not a student.', 401);
  next(error);
};
