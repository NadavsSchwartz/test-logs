import ErrorCard from '@/components/Error/ErrorCard';
import { LogoIcon } from '@/components/icons';
import CustomHead from 'components/CustomHead';
import Link from 'next/link';
import { FC } from 'react';

const Page404: FC = () => {
  return (
    <>
      <CustomHead title="Not Found" description="Not Found" />
      <div className={'not-found flex h-screen justify-center items-center'}>
        <ErrorCard
          title="Page not found 404"
          icon={<LogoIcon height={100} width={100} />}
          message={<p>The page you are looking for does not exist.</p>}
          link={<Link href="/">Return Home</Link>}
        />
      </div>
    </>
  );
};

export default Page404;
