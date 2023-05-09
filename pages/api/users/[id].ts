import { authOptions } from '@/lib/auth';
import { resizeBase64Image } from '@lib-server/resizeBase64Image';
import ApiError from 'lib-server/error';
import { requireAdmin } from 'lib-server/middleware/auth';
import { apiHandler } from 'lib-server/nc';
import { deleteUser, getUser, updateUser } from 'lib-server/services/users';
import {
  userIdCuidSchema,
  userUpdateSchema,
  validateUserIdCuid,
} from 'lib-server/validation';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { withValidation } from 'next-validations';
import { ClientUser, UserUpdateServiceData } from 'types/models/User';

const handler = apiHandler();

const validateUserUpdate = withValidation({
  schema: userUpdateSchema,
  type: 'Zod',
  mode: 'body',
});

const validateUserCuid = withValidation({
  schema: userIdCuidSchema,
  type: 'Zod',
  mode: 'query',
});

// GET /api/users/:id
// only for me query
handler.get(
  validateUserCuid(),
  async (req: NextApiRequest, res: NextApiResponse<ClientUser>) => {
    const id = validateUserIdCuid(req.query.id as string);
    const user = await getUser(id);
    if (!user) {
      throw new ApiError('User not found.', 404);
    }
    // 404 checked in service
    return res.status(200).json(user);
  }
);

handler.patch(
  validateUserCuid(),
  validateUserUpdate(),
  async (req: NextApiRequest, res: NextApiResponse<boolean>) => {
    const id = validateUserIdCuid(req.query.id as string);

    const { body } = req as NextApiRequest;
    const { firstName, lastName, oldPassword, newPassword, image } = body;
    const updateData = {
      firstName,
      lastName,
      oldPassword,
      newPassword,
      image,
    } as UserUpdateServiceData;

    const session = await getServerSession(req, res, authOptions);
    if (!session || session?.user?.role !== 'TEACHER') {
      throw new ApiError(`You're not authorized to perform this action.`, 401);
    }
    if (image) {
      updateData.image = await resizeBase64Image(image);
    }
    const user = await updateUser(id, updateData);
    return res.status(200).json(user);
  }
);

handler.delete(
  requireAdmin,
  validateUserCuid(),
  async (req: NextApiRequest, res: NextApiResponse<ClientUser>) => {
    const id = validateUserIdCuid(req.query.id as string);
    const session = await getServerSession(req, res, authOptions);

    if (!session || session?.user?.id !== id) {
      throw new ApiError('Not Authorized', 401);
    }

    const user = await deleteUser(id);
    return res.status(204).json(user);
  }
);

export default handler;
