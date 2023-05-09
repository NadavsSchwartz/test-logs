import { NextApiRequest, NextApiResponse } from 'next';

import ApiError from '@lib-server/error';
import { apiHandler } from '@lib-server/nc';
import prisma from '@lib-server/prisma';
import { updateUser } from '@lib-server/services/users';

const handler = apiHandler();

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  const rawPassword = req.body.password;
  const rawRequestId = req.body.requestId;

  const errorMessage = "Couldn't find an account for this email";

  if (!rawPassword || !rawRequestId) throw new ApiError(errorMessage, 400);

  const isValidRequest = await prisma.resetPasswordRequest.findUnique({
    where: {
      id: rawRequestId,
    },
  });
  if (!isValidRequest) throw new ApiError(errorMessage, 400);

  const isValidUser = await prisma.user.findUnique({
    where: {
      email: isValidRequest.email,
    },
  });

  if (!isValidUser) throw new ApiError(errorMessage, 400);

  const updatedUser = await updateUser(isValidUser.id, {
    newPassword: rawPassword,
  });
  if (!updatedUser) throw new ApiError(errorMessage, 400);

  await prisma.resetPasswordRequest.update({
    where: {
      id: rawRequestId,
    },
    data: {
      expires: new Date(),
    },
  });

  return res.status(200).json({ message: 'Password reset successful' });
});
export default handler;
