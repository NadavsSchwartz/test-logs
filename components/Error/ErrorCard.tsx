import { FC, ReactNode } from 'react';
import { ArrowRightIcon } from '../icons';

type Props = {
  title: string;
  icon: ReactNode;
  message: ReactNode;
  link: ReactNode;
};

const ErrorCard: FC<Props> = ({ title, icon, message, link }) => {
  return (
    <div className="flex flex-col gap-2 xs:gap-4 p-4 rounded-md w-full max-w-xs xs:max-w-md mx-4 xs:mx-0 bg-gray-200">
      <h1 className="">{title}</h1>
      <div className="flex  gap-1 items-center xs:flex-row">
        <div className="">{icon}</div>
        <div className="xs:self-center">{message}</div>
      </div>
      <div className="text-blue-500 font-semibold">
        {link}
        <ArrowRightIcon />
      </div>
    </div>
  );
};

export default ErrorCard;
