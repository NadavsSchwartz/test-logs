import { classNames } from '@/utility/className';
import { FC, ReactNode } from 'react';
import { BiErrorCircle } from 'react-icons/bi';
import {
  BsCheckCircleFill,
  BsFillExclamationCircleFill,
  BsInfoCircle,
} from 'react-icons/bs';
export type AlertProps = {
  title?: string;
  message?: string;
  actions?: ReactNode;
  className?: string;
  iconClassName?: string;
  variant: 'success' | 'warning' | 'error' | 'info';
};

const Alert: FC<AlertProps> = ({
  variant = 'info',
  className,
  iconClassName,
  actions,
  title,
  message,
}: AlertProps) => {
  return (
    <div
      className={classNames(
        'rounded-md border border-opacity-20 p-3',
        className,
        variant === 'error' && 'border-red-900 bg-red-50 text-red-800',
        variant === 'warning' &&
          'border-yellow-700 bg-yellow-50 text-yellow-700',
        variant === 'info' && 'border-sky-700 bg-sky-50 text-sky-700',
        variant === 'success' && 'bg-primaryBlack text-white'
      )}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          {variant === 'error' && (
            <BiErrorCircle
              className={classNames('h-5 w-5 text-red-400', iconClassName)}
              aria-hidden="true"
            />
          )}
          {variant === 'warning' && (
            <BsFillExclamationCircleFill
              className={classNames('h-5 w-5 text-yellow-400', iconClassName)}
              aria-hidden="true"
            />
          )}
          {variant === 'info' && (
            <BsInfoCircle
              className={classNames('h-5 w-5 text-sky-400', iconClassName)}
              aria-hidden="true"
            />
          )}
          {variant === 'success' && (
            <BsCheckCircleFill
              className={classNames('h-5 w-5 text-gray-100', iconClassName)}
              aria-hidden="true"
            />
          )}
        </div>
        <div className="ml-3 flex-grow">
          <h3 className="text-sm font-medium">{title}</h3>
          <div className="text-sm">{message}</div>
        </div>
        {actions && (
          <div className="absolute top-1 right-1 text-sm md:relative">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;
