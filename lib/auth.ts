import { getUser } from '@lib-server/services/users';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { User } from '@prisma/client';
import ApiError from 'lib-server/error';
import prisma from 'lib-server/prisma';
import { loginUser } from 'lib-server/services/auth';
import type { NextAuthOptions, Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { ClientUser } from 'types/models/User';
import { WEBAPP_URL } from './constants';

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  adapter: PrismaAdapter(prisma),

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
        console.log('credentials', credentials);
        if (!credentials) throw new ApiError('credentials are missing', 400);

        const { user, error } = await loginUser(credentials);

        if (error) throw new ApiError(error.message, 401);

        if (user?.emailVerified === null) {
          // send email for account verification
          // redirect to verification page
          throw new ApiError(
            `The email address associated with this account hasn't been verified yet. Please check your email for a verification link.`,
            401
          );
        }

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
      }
      return true;
    },
    // both jwt and session are used to attach user to session
    async jwt({ token, user }: any) {
      const updatedUser = await getUser(
        (token?.user?.id as string) || (user?.id as string)
      );
      token.user = updatedUser;

      return token;
    },
    async session({ session, token }) {
      let _session: Session | undefined = undefined;
      const user = token.user as ClientUser;
      // user's immutable props in session (id and email)
      // for session user use useUser React Query state
      if (user) {
        _session = {
          ...session,
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            active: user.active,
            name: user.name,
            image: user.image,
            firstName: user.firstName,
            lastName: user.lastName,
            // accessToken: _token.accessToken,
          },
        };
      }

      return _session as Session;
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
  secret: process.env.NEXTAUTH_SECRET,
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
  });
  return data;
}
// const scopes = [
//   'https://www.googleapis.com/auth/classroom.profile.emails',
//   'https://www.googleapis.com/auth/classroom.profile.photos',
//   'https://www.googleapis.com/auth/classroom.rosters',
//   'https://www.googleapis.com/auth/classroom.rosters.readonly',
//   'openid',
//   'profile',
//   'email',
// ];

// const scopes = [
//   'https://www.googleapis.com/auth/classroom.profile.emails',
//   'https://www.googleapis.com/auth/classroom.profile.photos',
//   'https://www.googleapis.com/auth/classroom.rosters',
//   'https://www.googleapis.com/auth/classroom.rosters.readonly',
//   'openid',
//   'profile',
//   'email',
// ];
