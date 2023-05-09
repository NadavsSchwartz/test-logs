import Button from '@/components/Button';
import { Routes, WEBAPP_URL } from '@/lib/constants';
import { useCreateUser } from '@/lib/react-query/auth/useCreateUser';
import { zodResolver } from '@hookform/resolvers/zod';
import { userLoginSchema, userRegisterSchema } from 'lib-server/validation';
import { signIn } from 'next-auth/react';
import Router, { useRouter } from 'next/router';
import React, { FC, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FiLock } from 'react-icons/fi';
import { UserCreateData, UserCreateFormData } from 'types/models/User';
import Alert from '../Alert';

import { EmailField, PasswordField, TextField } from './fields';
type Props = {
  isRegisterForm?: boolean;
};

const AuthForm: FC<Props> = ({ isRegisterForm = true }) => {
  const { register, handleSubmit, formState, ...rest } =
    useForm<UserCreateFormData>({
      resolver: zodResolver(
        isRegisterForm ? userRegisterSchema : userLoginSchema
      ),
    });
  const [loadingDashboard, setLoadingDashboard] = React.useState(false);

  Router.events.on('routeChangeStart', () => setLoadingDashboard(true));
  Router.events.on('routeChangeComplete', () => setLoadingDashboard(false));
  Router.events.on('routeChangeError', () => setLoadingDashboard(false));
  const [signInError, setSignInError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const {
    mutate: createUser,
    status,
    isError,
    error,
    isSuccess,
    data,
    isLoading,
  } = useCreateUser();

  const router = useRouter();

  let callbackUrl =
    typeof router.query?.callbackUrl === 'string'
      ? router.query.callbackUrl
      : '';

  if (/"\//.test(callbackUrl)) callbackUrl = callbackUrl.substring(1);

  // If not absolute URL, make it absolute
  if (!/^https?:\/\//.test(callbackUrl)) {
    callbackUrl = `${WEBAPP_URL}/${callbackUrl}`;
  }

  const onSubmitLogin = async ({ email, password }: UserCreateFormData) => {
    setSignInError('');
    setLoggingIn(true);
    const response = await signIn<'credentials'>('credentials', {
      email,
      password,
      callbackUrl,
      redirect: false,
    });
    setLoggingIn(false);
    if (response?.error) setSignInError(response.error);
    if (response?.ok) {
      // queryClient.removeQueries([QueryKeys.ME]); // remove old queries
      await router.push(Routes.SITE.HOME);
    }
  };
  const onSubmitRegister = async (registerData: UserCreateFormData) => {
    if (status === 'loading') return;
    createUser(registerData as UserCreateData);
  };

  const SuccessRegister = () => {
    return (
      <div className="space-y-6 text-sm leading-normal text-black">
        <p>
          An email is on it&apos;s way to way {data?.email} with a link to
          verify your account.
        </p>
        <p>If you don&apos;t receive an email soon, check your spam folder</p>
        {error && <p className="text-center text-red-600">{error.message}</p>}

        <Button
          type="button"
          className="w-full justify-center text-center"
          onClick={() => router.push(Routes.SITE.LOGIN)}
        >
          Back to Login
        </Button>
      </div>
    );
  };

  return (
    <div className="p-5 sm:max-w-md justify-center align-middle shadow rounded bg-white text-black">
      <div className="flex flex-col justify-between gap-4 mt-5">
        {isError && (
          <div className="flex">
            <Alert
              variant="error"
              message={(error as any).response?.data?.message || error.message}
            />
          </div>
        )}
        {signInError && (
          <div className="flex">
            <Alert variant="error" message={signInError} />
          </div>
        )}
        {isSuccess && <SuccessRegister />}
        {!isSuccess && (
          <>
            <div className="text-center">
              {isRegisterForm
                ? 'Register A New Account'
                : 'Login to your account'}
            </div>
            <FormProvider
              {...rest}
              handleSubmit={handleSubmit}
              formState={formState}
              register={register}
            >
              <form
                onSubmit={handleSubmit(
                  isRegisterForm ? onSubmitRegister : onSubmitLogin
                )}
                data-testid="auth-form"
              >
                {isRegisterForm && (
                  <div className="mb-6">
                    <TextField
                      label="First Name"
                      placeholder="Enter your first name"
                      type="text"
                      {...register('firstName')}
                    />
                  </div>
                )}
                {isRegisterForm && (
                  <div className="mb-6">
                    <TextField
                      label="Last Name"
                      placeholder="Enter your last name"
                      type="text"
                      {...register('lastName')}
                    />
                  </div>
                )}
                <div className="mb-6">
                  <EmailField
                    {...register('email')}
                    label="Email Address"
                    placeholder="Enter your email address"
                    name="email"
                  />
                </div>

                <div className="mt-6">
                  <PasswordField
                    {...register('password')}
                    label="Password"
                    name="password"
                  />
                </div>

                {isRegisterForm && (
                  <div className="mt-6">
                    <PasswordField
                      {...register('confirmPassword')}
                      label="Confirm Password"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between pt-5">
                  <Button
                    type="submit"
                    loading={loggingIn || isLoading || loadingDashboard}
                    className=" w-full py-1 rounded"
                    name="submit"
                  >
                    {isRegisterForm ? 'Sign up' : 'Sign in'}
                  </Button>
                </div>
                {/* divider */}
                {/* <div className="relative flex py-4 items-center">
            <div className="flex-grow ml-5 border-t border-gray-400" />
            <span className="flex-shrink mx-4 text-gray-400">OR</span>
            <div className="flex-grow border-t border-gray-400 mr-5" />
          </div> */}
                {/* social auth buttons */}
                {/* <div className="p-4">
            <div className="grid">
              <div className="w-full space-y-4 text-center bg-primary">
                {Object.values(providers).map((provider) => (
                  <div key={provider.name}>
                    <Button
                      className="border  text-gray-500 w-full py-2.5 "
                      onClick={() => signIn(provider.id)}
                    >
                      Sign in with {provider.name}
                    </Button>
                  </div>
                ))} 
              </div>
            </div>
          </div>*/}
                <div className="flex flex-col lg:flex-row items-center justify-center lg:space-x-2">
                  {!isRegisterForm && (
                    <div className="text-center">
                      <Button
                        href={Routes.SITE.FORGOT_PASSWORD}
                        color="minimal"
                        StartIcon={FiLock}
                      >
                        Forgot Password
                      </Button>
                    </div>
                  )}
                  {!isRegisterForm ? (
                    <Button href={Routes.SITE.REGISTER} color="minimal">
                      Don&apos;t have an account?
                    </Button>
                  ) : (
                    <Button href={Routes.SITE.LOGIN} color="minimal">
                      Already have an account?
                    </Button>
                  )}
                </div>
              </form>
            </FormProvider>
          </>
        )}
      </div>
    </div>
  );
};
export default AuthForm;
