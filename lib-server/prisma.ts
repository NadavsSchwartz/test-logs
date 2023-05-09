import { Prisma, PrismaClient, User } from '@prisma/client';
import { ClientUser } from 'types/models/User';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prismaOptions: Prisma.PrismaClientOptions = {};

// if (!!process.env.NEXT_PUBLIC_DEBUG)
//   prismaOptions.log = ['query', 'error', 'warn'];

export const prisma = globalThis.prisma || new PrismaClient(prismaOptions);

export const customPrisma = (options: Prisma.PrismaClientOptions) =>
  new PrismaClient({ ...prismaOptions, ...options });

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default prisma;
export const exclude = <T, Key extends keyof T>(
  model: T,
  ...keys: Key[]
): Omit<T, Key> => {
  if (!model) throw new Error('Model arg is missing.');

  for (const key of keys) {
    delete model[key];
  }
  return model;
};

export const excludeFromUser = (user: User): ClientUser => {
  return exclude(user, 'password');
};
