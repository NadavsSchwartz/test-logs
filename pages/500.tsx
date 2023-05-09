import ErrorCard from '@/components/Error/ErrorCard';
import { ErrorIcon } from '@/components/icons';
import CustomHead from 'components/CustomHead';
import Link from 'next/link';
import { FC } from 'react';

const Page500: FC = () => {
  return (
    <>
      <CustomHead title="Server Error" description="Server Error" />

      <div className={'custom-500 flex h-screen justify-center items-center'}>
        <ErrorCard
          title="500 - Server-side error occurred"
          icon={<ErrorIcon width={100} height={100} />}
          message={<p>Internal Server Error.</p>}
          link={<Link href="/">Return Home</Link>}
        />
      </div>
    </>
  );
};

export default Page500;
