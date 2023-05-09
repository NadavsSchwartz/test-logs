import { NextApiRequest, NextApiResponse } from 'next';
import { ZodError } from 'zod';
export class HttpError<TCode extends number = number> extends Error {
  public readonly cause?: Error;
  public readonly statusCode: TCode;
  public readonly message: string;
  public readonly url: string | undefined;
  public readonly method: string | undefined;

  constructor(opts: {
    url?: string;
    method?: string;
    message?: string;
    statusCode: TCode;
    cause?: Error;
  }) {
    super(opts.message ?? `HTTP Error ${opts.statusCode} `);

    Object.setPrototypeOf(this, HttpError.prototype);
    this.name = HttpError.prototype.constructor.name;

    this.cause = opts.cause;
    this.statusCode = opts.statusCode;
    this.url = opts.url;
    this.method = opts.method;
    this.message = opts.message ?? `HTTP Error ${opts.statusCode}`;

    if (opts.cause instanceof Error && opts.cause.stack) {
      this.stack = opts.cause.stack;
    }
  }

  public static fromRequest(request: Request, response: Response) {
    return new HttpError({
      message: response.statusText,
      url: response.url,
      method: request.method,
      statusCode: response.status,
    });
  }
}
export default class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);

    // // set constructor name for Jest toBeInstanceOf()
    // Object.setPrototypeOf(this, ApiError.prototype);
  }

  static fromZodError(error: ZodError): ApiError {
    return new this(error.toString(), 400);
  }
}

export const handleApiError = (
  error: any,
  req: NextApiRequest,
  res: NextApiResponse
) => {
  console.error(error);
  const isProd = process.env.NODE_ENV === 'production';

  const response = {
    ...(!isProd && { stack: error.stack }),
    message: error.message,
    statusCode: error.statusCode,
    isOperational: error.isOperational,
  };
  // if status > 399 => error
  return res.status(error.statusCode || 500).json(response);
};

export const handleSsrError = (error: any) => {
  console.error('handled SSR error: ', error);
};

export function getErrorFromUnknown(
  cause: unknown
): Error & { statusCode?: number; code?: string } {
  if (cause instanceof Error) {
    return cause;
  }
  if (typeof cause === 'string') {
    return new Error(cause, { cause });
  }

  return new Error(`Unhandled error of type '${typeof cause}''`);
}
