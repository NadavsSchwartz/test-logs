import { defaultAvatarSrc } from '@/lib/defaultAvatar';
import { apiHandler } from '@lib-server/nc';
import prisma from '@lib-server/prisma';
import crypto from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
const querySchema = z.object({
  email: z.string().email(),
});

async function getUserData(req: NextApiRequest) {
  const { email } = querySchema.parse(req.query);

  if (email) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { image: true, email: true, firstName: true, lastName: true },
    });
    return {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      image: user?.image,
    };
  }
}
const handler = apiHandler();
handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await getUserData(req);
  const img = user?.image;
  // If image isn't set or links to this route itself, use default avatar
  if (!img) {
    res.writeHead(302, {
      Location: defaultAvatarSrc({
        md5: crypto
          .createHash('md5')
          .update(user?.email || 'guest@example.com')
          .digest('hex'),
      }),
    });
    return res.end();
  }

  if (!img.includes('data:image')) {
    res.writeHead(302, { Location: img });
    return res.end();
  }

  const decoded = img
    .toString()
    .replace('data:image/png;base64,', '')
    .replace('data:image/jpeg;base64,', '');
  const imageResp = Buffer.from(decoded, 'base64');
  res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': imageResp.length,
  });
  res.end(imageResp);
});

export default handler;
