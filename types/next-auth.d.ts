import { User as PrismaUser } from '@prisma/client';
import type { DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface User extends Omit<DefaultUser, 'id'> {
    id: PrismaUser['id'];
    emailVerified?: PrismaUser['emailVerified'];
    active?: boolean;
    role?: PrismaUser['role'];
  }
  interface Session {
    user: Partial<PrismaUser>;
    expires: string;
    userToken: string;
  }
}
declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    user: Partial<PrismaUser>;
  }
}
