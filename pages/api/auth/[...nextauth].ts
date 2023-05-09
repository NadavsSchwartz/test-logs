import { WEBAPP_URL } from '@/lib/constants';
import ApiError from '@lib-server/error';
import prisma from '@lib-server/prisma';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { User } from '@prisma/client';
import { compare } from 'bcryptjs';
import type { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { Session } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
/**
 * @swagger
 *
 * /api/auth/csrf:
 *   get:
 *     description: Get CSRF token
 *     tags:
 *     - game-services
 *     - web
 *     responses:
 *      200:
 *       description: CSRF token
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               csrfToken:
 *                 type: string
 *                 example: cb193b9c9b03bb0372636d314e2ecd9e1f1dec52f5707d7f18ff1c7559e429da
 *      401:
 *       description: Unauthorized
 *
 * /api/auth/callback/credentials?:
 *   post:
 *     description: Login to using email and password
 *     tags:
 *     - game-services
 *     - web
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - csrfToken
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               csrfToken:
 *                 type: string
 *               json:
 *                type: boolean
 *                description: If true, return json response
 *                example: true
 *     responses:
 *       200:
 *         description: Login was successful
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               description: The Next Auth session token stored in a cookie
 *               example: __Secure-next-auth.session-token=s%3AJDJhJDEwJFVmMTNjTUZmNGpXZWV4ZjdTZjlmTjQwTm1ucTQ3N3NNbVN2NlZnWVZNanpCYkVjc0t1NzFVZm5D.O5uu5R1qq9i%2BbnNF3FneYM%2Bf0Mjw8IVUPL064P%2FvO9Q; Path=/; HttpOnly; Secure; SameSite=Strict
 *       401:
 *        description: Unauthorized
 *
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
  return await NextAuth(req, res, {
    logger: {
      error(code, metadata) {
        console.error(code, metadata);
      },
      warn(code) {
        console.warn(code);
      },
      debug(code, metadata) {
        console.debug(code, metadata);
      },
    },
    // debug: process.env.NODE_ENV === 'development',
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
      CredentialsProvider({
        id: 'credentials',
        name: 'Credentials',
        credentials: {
          email: {
            label: 'Email',
            type: 'email',
          },
          password: {
            label: 'Password',
            type: 'password',
          },
        },
        // redirect to same page and parse query params, unable to return api res
        async authorize(credentials) {
          if (!credentials) throw new ApiError('credentials are missing', 400);

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email.toLowerCase(),
            },
            select: {
              role: true,
              id: true,
              firstName: true,
              email: true,
              lastName: true,
              password: true,
              emailVerified: true,
              active: true,
              // classrooms: {
              //   select: {
              //     id: true,
              //     displayName: true,
              //   },
              // },
            },
          });

          // Don't leak information about it being email or password that is invalid
          if (!user) throw new ApiError('Incorect email or password', 404);
          // const { user, error } = await loginUser(credentials);
          if (!user.active) throw new ApiError('User is not active', 401);
          if (!user.emailVerified)
            throw new ApiError('User is not verified', 401);
          if (!user.password) throw new ApiError('User has no password', 401);
          const isCorrectPassword = await compare(
            credentials.password,
            user.password
          );
          if (!isCorrectPassword)
            throw new ApiError('Incorect email or password', 401);

          return user;
        },
      }),
    ],
    session: {
      strategy: 'jwt',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      updateAge: 24 * 60 * 60, // 24 hours
    },

    callbacks: {
      async signIn({ user }) {
        if (user) {
          // update lastLoggedInAt
          const data = await updateUserLastLoggedInAt(user as User);

          user = { ...user, ...data };
          return true;
        }
        return false;
      },
      // both jwt and session are used to attach user to session
      async jwt({ token }: any) {
        const updatedUser = await prisma.user.findFirst({
          where: {
            email: token.email,
          },
          select: {
            role: true,
            id: true,
            firstName: true,
            email: true,
            lastName: true,
            emailVerified: true,
            active: true,
            // classrooms: {
            //   select: {
            //     id: true,
            //     displayName: true,
            //   },
            // },
            // classroomMembership: {
            //   select: {
            //     classroom: {
            //       select: {
            //         id: true,
            //         displayName: true,
            //       },
            //     },
            //   },
            // },
          },
        });
        token.user = { ...updatedUser };

        return token;
      },
      async session({ session, token }) {
        const userToken = await getToken({
          req,
          secret: process.env.NEXTAUTH_SECRET,
          raw: true,
        });
        const user = token.user as User;
        const _session: Session = {
          ...session,
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            active: user.active,
            name: user.name,
            firstName: user.firstName,
            lastName: user.lastName,
          },
          userToken,
        };
        return _session;
      },
      async redirect({ url, baseUrl }) {
        // Allows relative callback URLs
        if (url.startsWith('/')) return `${baseUrl}${url}`;
        // Allows callback URLs on the same domain
        else if (new URL(url).hostname === new URL(WEBAPP_URL).hostname)
          return url;
        return baseUrl;
      },
    },

    pages: {
      signIn: '/auth/signin',
      verifyRequest: '/auth/verify-account',
      newUser: '/auth/new-user',
      error: '/auth/error',
    },
  });
};
/**
 * Update lastLoggedInAt on Login
 */
async function updateUserLastLoggedInAt(user: User) {
  const data = {
    lastLoggedInAt: new Date().toISOString(),
  } as any;

  await prisma.user.update({
    where: { id: user.id },
    data,
    select: {
      classrooms: {
        select: {
          id: true,
          displayName: true,
        },
      },
    },
  });
  return data;
}
