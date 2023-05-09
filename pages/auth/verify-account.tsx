import Button from '@/components/Button';
import CustomHead from '@/components/CustomHead';
import Spinner from '@/components/Loading/Spinner';
import { useVerifyAccount } from '@/lib/react-query/auth/useVerifyAccount';
import { AxiosError } from 'axios';

import { GetServerSidePropsContext } from 'next';
import React, { FC } from 'react';

type Props = {
  token: string;
  userId: string;
};
const VerifyAccount: FC<Props> = (props) => {
  const {
    mutate: verifyAccount,

    isError,
    error,
    isSuccess,
    isLoading,
  } = useVerifyAccount();

  // todo - fix this running twice due to react 18 changes.
  React.useEffect(() => {
    verifyAccount(props);
  }, [props]);

  const Success = () => {
    return (
      <>
        <div className="space-y-6">
          <div>
            <h2 className="mt-6 text-center text-xl font-extrabold text-gray-900">
              Account confirmed successfully.
            </h2>
          </div>

          <Button href={'/auth/signin'} className="w-full text-center">
            Login
          </Button>
        </div>
      </>
    );
  };
  const Error = () => {
    return (
      <>
        <div className="space-y-4">
          <div>
            <h2 className="text-center text-xl font-extrabold text-gray-900">
              The account confirmation process could not be completed
            </h2>
          </div>

          <p className="pb-3">
            {(error?.response?.data as AxiosError).message || error?.message}
          </p>

          <Button href={'/auth/signin'} className="w-full text-center">
            Login
          </Button>
        </div>
      </>
    );
  };

  //  const isVerified = await verifyUser(token as string, userId as string);
  //console.log('isVerified', isVerified);
  return (
    <div className="flex min-h-screen flex-col justify-center  py-12 sm:px-6 lg:px-8">
      <CustomHead title="Forgot Password" description="Reset your password" />
      <div className="text-center sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl text-neutral-900">
          Account Confirmation
        </h2>
      </div>
      <div
        className={'flex justify-center items-center w-full mt-2 text-center '}
      >
        <div className="xs:w-full xs:max-w-md justify-center align-middle shadow rounded bg-white px-4 py-5 mt-8">
          {isLoading && <Spinner />}
          {isError && !isLoading && <Error />}
          {isSuccess && !isLoading && <Success />}
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { token, userId } = context.query;

  if (!token || !userId) {
    return {
      notFound: true,
    };
  }

  const props = {
    token,
    userId,
  };
  return {
    props,
  };
}
export default VerifyAccount;
