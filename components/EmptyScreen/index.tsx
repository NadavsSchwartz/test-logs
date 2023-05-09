import React, { ReactNode } from 'react';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import Button from '../Button';

export default function EmptyScreen({
  Icon,
  headline,
  description,
  buttonText,
  buttonOnClick,
  buttonRaw,
}: {
  Icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  headline: string;
  description: string | React.ReactElement;
  buttonText?: string;
  buttonOnClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  buttonRaw?: ReactNode; // Used incase you want to provide your own button.
}) {
  return (
    <>
      <div className="min-h-80 flex w-full flex-col items-center justify-center rounded-md border border-dashed p-7 lg:p-20">
        <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-gray-200">
          {Icon ? (
            <Icon className="inline-block h-10 w-10 stroke-[1.3px" />
          ) : (
            <IoIosInformationCircleOutline className="inline-block h-10 w-10 stroke-[1.3px] text-black" />
          )}
        </div>
        <div className="flex max-w-[420px] flex-col items-center">
          <h2 className="text-semibold mt-6 text-xl text-black">{headline}</h2>
          <p className="mt-3 mb-8 text-center text-sm font-normal leading-6 text-gray-700">
            {description}
          </p>
          {buttonOnClick && buttonText && (
            <Button onClick={(e) => buttonOnClick(e)}>{buttonText}</Button>
          )}
          {buttonRaw}
        </div>
      </div>
    </>
  );
}
