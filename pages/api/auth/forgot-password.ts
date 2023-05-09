import { ResetPasswordRequest } from '@prisma/client';
import dayjs from 'dayjs';
import { NextApiRequest, NextApiResponse } from 'next';

import { WEBAPP_URL } from '@/lib/constants';
import ApiError from '@lib-server/error';
import { apiHandler } from '@lib-server/nc';
import prisma from '@lib-server/prisma';
import { sendPasswordResetEmail } from '@lib-server/services/users';

/*
 * @swagger
 * /api/auth/callback/credentials:
 *
 */
const handler = apiHandler();

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.body;

  if (!email) throw new ApiError('Email is required', 401);

  const isUserExists = await prisma.user.findUnique({
    where: {
      email: req.body?.email?.toLowerCase(),
    },
    select: {
      firstName: true, // for email
      email: true,
    },
  });

  if (!isUserExists) {
    // Don't leak information about whether an email is registered or not
    return res.status(200).json({
      message:
        'If this email exists in our system, you should receive a Reset email.',
    });
  }

  const maybePreviousRequest = await prisma.resetPasswordRequest.findMany({
    where: {
      email: isUserExists.email as string,
      expires: {
        gt: new Date(),
      },
    },
  });

  let passwordRequest: ResetPasswordRequest;

  if (maybePreviousRequest && maybePreviousRequest?.length >= 1) {
    passwordRequest = maybePreviousRequest[0];
  } else {
    const expiry = dayjs().add(6, 'hours').toDate();
    const createdResetPasswordRequest =
      await prisma.resetPasswordRequest.create({
        data: {
          email: isUserExists.email as string,
          expires: expiry,
        },
      });
    passwordRequest = createdResetPasswordRequest;
  }

  const resetLink = `${WEBAPP_URL}/auth/forgot-password/${passwordRequest.id}`;
  const isEmailSent = await sendPasswordResetEmail({
    user: isUserExists as any,
    resetLink,
  });

  if (!isEmailSent) {
    return res.status(500).json({
      message: 'Something went wrong. Please try again later.',
    });
  }

  return res.status(201).json({
    message:
      'If this email exists in our system, you should receive a Reset email.',
  });
});
export default handler;
