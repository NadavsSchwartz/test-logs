import Alert from '@/components/Alert';
import Button from '@/components/Button';
import CustomHead from '@/components/CustomHead';
import { EmailField } from '@/components/Forms/fields';
import { Routes } from '@/lib/constants';
import { useForgotPassword } from '@/lib/react-query/auth/useForgotPassword';
import { zodResolver } from '@hookform/resolvers/zod';
import { userForgotPasswordSchema } from 'lib-server/validation';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { UserForgotPasswordData } from 'types/models/User';
const ForgotPassword: FC = () => {
  const { register, handleSubmit, formState, getValues } =
    useForm<UserForgotPasswordData>({
      resolver: zodResolver(userForgotPasswordSchema),
    });

  const {
    mutate: forgotPassword,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useForgotPassword();

  const { errors } = formState;

  const onSubmitRegisterPassword = async ({
    email,
  }: UserForgotPasswordData) => {
    forgotPassword(email);
  };

  const Success = () => {
    return (
      <div className="space-y-6 text-sm leading-normal text-black">
        <p className="">
          An email is on it&quot;s way to way {getValues('email')} with a link
          to reset your password.
        </p>
        <p className="">
          If you don&rsquo;t receive an email soon, check that the email address
          you entered for typos, and check your spam folder
        </p>
        {error && <p className="text-center text-red-600">{error.message}</p>}
        <div className="w-full justify-center text-center">
          <Button type="button" className="w-full" href={Routes.SITE.LOGIN}>
            Back to Login
          </Button>
        </div>
      </div>
    );
  };
  return (
    <div className="flex min-h-screen flex-col justify-center py-12  px-6 lg:px-8">
      <CustomHead title="Forgot Password" description="Reset your password" />
      <div className="text-center sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl text-neutral-900">
          Forgot Password?
        </h2>
      </div>
      <div className="flex justify-center items-center w-full mt-8">
        <div className="w-full max-w-md justify-center align-middle shadow rounded bg-white px-4 py-5">
          {isError && (
            <Alert
              variant="error"
              message={(error as any).response?.data?.message || error.message}
            />
          )}
          {isSuccess ? (
            <Success />
          ) : (
            <form
              className="flex flex-col"
              onSubmit={handleSubmit(onSubmitRegisterPassword)}
            >
              <EmailField
                {...register('email')}
                label="Email Address"
                type="email"
                required
                placeholder="Enter your email address"
              />
              {errors.email && (
                <Alert variant="error" message={errors.email.message} />
              )}
              <div className="flex flex-col lg:flex-row items-center justify-center pt-5">
                <Button
                  type="submit"
                  loading={isLoading}
                  className="bg-black w-full"
                >
                  Reset Password
                </Button>

                <Button href={Routes.SITE.LOGIN} color="minimal">
                  Login
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
