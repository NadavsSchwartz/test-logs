import { NextApiRequest, NextApiResponse } from 'next';

import ApiError from '@lib-server/error';
import { apiHandler } from '@lib-server/nc';
import {
  sendConfirmedAccountEmail,
  verifyUser,
} from '@lib-server/services/users';

const handler = apiHandler();

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  const { token, userId } = req.body;

  if (!token || !userId) {
    throw new ApiError('Invalid request', 400);
  }

  const isUserVerified = await verifyUser(token as string, userId as string);

  const isEmailSent = await sendConfirmedAccountEmail({
    user: isUserVerified,
  });

  if (!isEmailSent) {
    throw new ApiError('Email not sent', 500);
  }

  res.status(200).json({ message: 'Account verified' });
});
export default handler;
