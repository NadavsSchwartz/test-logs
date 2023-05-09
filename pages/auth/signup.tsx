import CustomHead from '@/components/CustomHead';
import AuthForm from '@/components/Forms/auth';
import { Logo } from '@/components/icons';
import { authOptions } from '@/lib/auth';
import type { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth/next';
import { getProviders } from 'next-auth/react';
const SignUp = () => {
  return (
    <>
      <CustomHead title="Sign Up - MindLabs" />

      <div className="min-h-screen flex flex-col justify-center py-12 ">
        <div className="mx-auto mb-2 ">
          <Logo className="w-fit h-[54px] sm:h-[64px]" />
        </div>
        <div className="p-5 mx-auto w-full sm:max-w-md">
          <AuthForm isRegisterForm={true} />
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { req, res } = context;
  const session = await getServerSession(req, res, authOptions);

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  const providers = await getProviders();
  return {
    props: { providers },
  };
};

export default SignUp;
