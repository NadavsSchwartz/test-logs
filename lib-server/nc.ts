import { ServerResponse } from 'http';

import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { NextReq } from 'types';
import ApiError, { handleApiError, handleSsrError } from './error';

export const ncOptions = {
  onError(error: Error, req: NextApiRequest, res: NextApiResponse) {
    handleApiError(error, req, res);
  },
  onNoMatch(req: NextApiRequest, res: NextApiResponse) {
    const error = new ApiError(`Method '${req.method}' not allowed`, 405);
    //not in api, handle it manually
    handleApiError(error, req, res);
  },
};

/**
 * single instance must be default exported from file
 */
export const apiHandler = () => {
  return nc<NextApiRequest, NextApiResponse>(ncOptions);
};

// ---------- getServerSideProps error handler

export type NextApiRequestWithResult<T> = NextApiRequest & { result: T };

/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */
export const ssrNcHandler = async <T extends unknown>(
  req: NextReq,
  res: ServerResponse,
  callback: () => Promise<T>
) => {
  const base = () => {
    const handler = nc<NextApiRequestWithResult<T>, NextApiResponse>(
      ncOptions
    ).use(async (req, res, next) => {
      req.result = await callback();
      next();
    });

    return handler;
  };

  const _req = req as NextApiRequestWithResult<T>;
  const _res = res as NextApiResponse;

  try {
    await base().run(_req, _res);

    return _req.result as T;
  } catch (error) {
    handleSsrError(error);
    return null;
  }
};

export default nc;
