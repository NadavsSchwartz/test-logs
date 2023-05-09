import Shell from '@/components/Layout/Shell';
import { authOptions } from '@/lib/auth';
import { Redirects } from '@/lib/constants';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import type { GetServerSideProps, NextPage } from 'next';
import { getServerSession } from 'next-auth/next';
const Home: NextPage = () => {
  return (
    <Shell
      heading={'Main Page'}
      subtitle={'Will contain summarized collection of events for easy access'}
    >
      <div>TBD</div>
    </Shell>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) return Redirects.LOGIN;

  const queryClient = new QueryClient();

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
export default Home;
