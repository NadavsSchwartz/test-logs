import ErrorCard from '@/components/Error/ErrorCard';
import { WEBAPP_URL } from '@/lib/constants';
import { getErrorFromUnknown, HttpError } from '@lib-server/error';
import * as Sentry from '@sentry/nextjs';
import { NextPageContext } from 'next';
import NextError, { ErrorProps } from 'next/error';
import { FiInfo } from 'react-icons/fi';

// Adds HttpException to the list of possible error types.
type AugmentedError = (NonNullable<NextPageContext['err']> & HttpError) | null;
type CustomErrorProps = {
  err?: AugmentedError;
  message?: string;
  hasGetInitialPropsRun?: boolean;
} & Omit<ErrorProps, 'err'>;

getErrorFromUnknown;
const CustomError = (props: any) => {
  const e = getErrorFromUnknown(props.error);

  return (
    <ErrorCard
      message={e.message}
      link={WEBAPP_URL}
      title={'error'}
      icon={<FiInfo />}
    />
  );
};

CustomError.getInitialProps = async (contextData: any) => {
  const { res, err, asPath } = contextData;
  await Sentry.captureUnderscoreErrorException(contextData);
  const errorInitialProps = (await NextError.getInitialProps({
    res,
    err,
  } as NextPageContext)) as CustomErrorProps;

  // Workaround for https://github.com/vercel/next.js/issues/8592, mark when
  // getInitialProps has run
  errorInitialProps.hasGetInitialPropsRun = true;

  // If a HttpError message, let's override defaults
  if (err instanceof HttpError) {
    errorInitialProps.statusCode = err.statusCode;
    errorInitialProps.title = err.name;
    errorInitialProps.message = err.message;
    errorInitialProps.err = err;
  }

  if (res) {
    // Running on the server, the response object is available.
    //
    // Next.js will pass an err on the server if a page's `getInitialProps`
    // threw or returned a Promise that rejected

    // Overrides http status code if present in errorInitialProps
    res.statusCode = errorInitialProps.statusCode;

    console.error(
      `server side logged this: ${err?.toString() ?? JSON.stringify(err)}`
    );
    console.info('return props, ', errorInitialProps);

    return errorInitialProps;
  } else {
    // Running on the client (browser).
    //
    // Next.js will provide an err if:
    //
    //  - a page's `getInitialProps` threw or returned a Promise that rejected
    //  - an exception was thrown somewhere in the React lifecycle (render,
    //    componentDidMount, etc) that was caught by Next.js's React Error
    //    Boundary. Read more about what types of exceptions are caught by Error
    //    Boundaries: https://reactjs.org/docs/error-boundaries.html
    if (err) {
      console.info('client side logged this', err);
      return errorInitialProps;
    }
  }

  // If this point is reached, getInitialProps was called without any
  // information about what the error might be. This is unexpected and may
  // indicate a bug introduced in Next.js
  new Error(`_error.tsx getInitialProps missing data at path: ${asPath}`);

  return errorInitialProps;
};

export default CustomError;
