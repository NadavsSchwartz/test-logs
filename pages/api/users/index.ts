import { Routes, WEBAPP_URL } from '@/lib/constants';
import { apiHandler } from '@lib-server/nc';
import {
  createUser,
  deleteUser,
  sendVerificationEmail,
} from 'lib-server/services/users';
import { userRegisterSchema } from 'lib-server/validation';
import { NextApiRequest, NextApiResponse } from 'next';
import { withValidation } from 'next-validations';

import { ClientUser } from 'types/models/User';
const handler = apiHandler();
const validateUserRegister = withValidation({
  schema: userRegisterSchema.innerType().omit({
    confirmPassword: true,
  }),
  type: 'Zod',
  mode: 'body',
});

/**
 * POST /api/users - register
 * Required fields in body: name, username, email, password
 */
handler.post(
  validateUserRegister(),
  async (req: NextApiRequest, res: NextApiResponse<ClientUser>) => {
    const user = await createUser(req.body);
    const confirmationLink = `${WEBAPP_URL}/${Routes.SITE.VERIFY_ACCOUNT}?token=${user.verificationToken}&userId=${user.id}`;
    const isEmailSent = await sendVerificationEmail({
      user: user as any,
      confirmationLink,
    });
    if (!isEmailSent) {
      await deleteUser(user.id);
      throw new Error(
        'Unable to send verification email, please try registering again.'
      );
    }
    return res.status(201).json(user);
  }
);

export default handler;
