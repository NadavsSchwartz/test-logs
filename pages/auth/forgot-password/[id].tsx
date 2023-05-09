import Alert from '@/components/Alert';
import Button from '@/components/Button';
import CustomHead from '@/components/CustomHead';
import { PasswordField } from '@/components/Forms/fields';
import Spinner from '@/components/Loading/Spinner';
import { Routes } from '@/lib/constants';
import { useResetPassword } from '@/lib/react-query/auth/useResetPassword';
import { zodResolver } from '@hookform/resolvers/zod';
import prisma from '@lib-server/prisma';
import { ResetPasswordRequest } from '@prisma/client';
import dayjs from 'dayjs';
import { userResetPasswordSchema } from 'lib-server/validation';
import { GetServerSidePropsContext } from 'next';
import { getCsrfToken } from 'next-auth/react';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { UserResetPasswordData } from 'types/models/User';
type Props = {
  id: string;
  resetPasswordRequest: ResetPasswordRequest;
  csrfToken: string;
};

export default function ResetPassword({
  resetPasswordRequest,
  csrfToken,
}: Props) {
  const { register, handleSubmit, formState } = useForm<UserResetPasswordData>({
    resolver: zodResolver(userResetPasswordSchema),
  });

  const {
    mutate: resetPassword,
    isError,
    error,
    isSuccess,
    isLoading,
  } = useResetPassword();

  const { errors } = formState;

  const onSubmitRegisterPassword = async ({
    password,
  }: UserResetPasswordData) => {
    const requestId = resetPasswordRequest.id;
    resetPassword({ requestId, password });
  };

  const Success = () => {
    return (
      <div className="space-y-4 text-black">
        <div>
          <h2 className="mt-1 text-center text-xl font-extrabold text-gray-900">
            Password updated successfully
          </h2>
        </div>
        <p className="text-center">
          Feel free to use the link below and Sign in.
        </p>
        <div className="py-2">
          <Button href={Routes.SITE.LOGIN} className="w-full ">
            Login
          </Button>
        </div>
      </div>
    );
  };

  const Expired = () => {
    return (
      <>
        <div className="xs:w-full xs:max-w-md justify-center align-middle shadow rounded bg-white px-4 py-5">
          <div className="flex flex-col justify-between mt-2">
            <div>
              <h2 className=" text-center text-3xl font-extrabold text-gray-900">
                Whoops, this link has expired.
              </h2>
            </div>
            <p className="text-center py-4">
              Please click below to issue a new link.
            </p>

            <Button
              href={Routes.SITE.FORGOT_PASSWORD}
              passHref
              className="w-full px-4 py-2"
            >
              Try again
            </Button>
          </div>
        </div>
      </>
    );
  };

  const isRequestExpired = useMemo(() => {
    const now = dayjs();
    return dayjs(resetPasswordRequest.expires).isBefore(now);
  }, [resetPasswordRequest]);

  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
      <CustomHead title="Forgot Password" description="Reset your password" />
      <div className="text-center sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl text-neutral-900">
          Reset Password
        </h2>
      </div>
      <div className={'flex justify-center items-center w-full mt-8'}>
        {isRequestExpired && <Expired />}
        {!isRequestExpired && (
          <div className="xs:w-full xs:max-w-md justify-center align-middle shadow rounded bg-white px-4 py-5 text-black">
            <div className="flex flex-col justify-between mt-2">
              {isError && !isLoading && (
                <div className="flex pb-4 justify-center">
                  <Alert
                    variant="error"
                    message={
                      (error as any).response?.data?.message || error.message
                    }
                  />
                </div>
              )}
              {isLoading && <Spinner />}
              {isSuccess && !isLoading && <Success />}
              {!isSuccess && !isLoading && (
                <>
                  <form onSubmit={handleSubmit(onSubmitRegisterPassword)}>
                    <input
                      name="csrfToken"
                      type="hidden"
                      defaultValue={csrfToken}
                      hidden
                    />
                    <div className="mt-1">
                      <PasswordField
                        label={'New Password'}
                        {...register('password')}
                        id="password"
                        name="password"
                      />
                      {errors.password && (
                        <Alert
                          variant="error"
                          message={errors.password.message}
                        />
                      )}
                    </div>
                    <div className="mt-1 mb-3">
                      <PasswordField
                        label={'Password Confirmation'}
                        {...register('confirmPassword')}
                        id="confirmPassword"
                        name="confirmPassword"
                      />
                      {errors.confirmPassword && (
                        <Alert
                          variant="error"
                          message={errors.confirmPassword.message}
                        />
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-4 mt-2">
                      <Button
                        type="submit"
                        loading={isLoading || formState.isSubmitting}
                        className="w-full"
                      >
                        Change Password
                      </Button>

                      <Button href={Routes.SITE.LOGIN} color="minimal">
                        login
                      </Button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const id = context.params?.id as string;

  try {
    const resetPasswordRequest =
      await prisma.resetPasswordRequest.findUniqueOrThrow({
        where: {
          id,
        },
        select: {
          id: true,
          expires: true,
        },
      });

    return {
      props: {
        resetPasswordRequest: {
          ...resetPasswordRequest,
          expires: resetPasswordRequest.expires.toString(),
        },
        id,
        csrfToken: await getCsrfToken({ req: context.req }),
      },
    };
  } catch (reason) {
    return {
      notFound: true,
    };
  }
}
