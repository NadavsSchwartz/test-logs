import { IncomingMessage } from 'http';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';

/**
 * api NextApiRequest req.query
 */
export type QueryParamsType = Partial<{
  [key: string]: string | string[];
}>;

/**
 * getServerSideProps req
 */
export type NextReq = IncomingMessage & {
  cookies: NextApiRequestCookies;
};

/**
 * all props in object non-nullable
 */
export type RequiredNotNull<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};
