// @TODO: turn this into a more generic component that has the same Props API as MUI https://mui.com/material-ui/react-card/
import { classNames } from '@/utility/className';
import dayjs from 'dayjs';
import type { ReactNode } from 'react';
import React from 'react';
import { FiArrowRight } from 'react-icons/fi';

import Button from '../Button';

export type BaseCardProps = {
  classroomDisplayName?: string;
  icon?: ReactNode;
  variant: keyof typeof cardTypeByVariant;
  displayName: string;
  unit?: ReactNode;
  containerProps?: JSX.IntrinsicElements['div'];
  actionLink?: {
    href: string;
    child: ReactNode;
  };
  actionButton?: {
    href?: string;
    child: ReactNode;
    onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    disabled?: boolean;
  };
  learnMore?: {
    href: string;
    text: string;
  };
  grade?: string;
  roomKey?: string;
  dueDate?: string | Date;
  startDate?: string | Date;
  endDate?: string | Date;
  accessCode?: string;
};

const cardTypeByVariant = {
  assignment: {
    card: 'p-2',
    displayName: 'text-base leading-5 capitalize',
    bodyInfo: 'text-sm leading-[18px] text-gray-500 font-normal',
  },
  classroom: {
    card: 'p-2',
    displayName: 'text-base leading-5 capitalize',
    bodyInfo: 'text-sm leading-[18px] text-gray-500 font-normal ',
  },
};

export function Card({
  displayName,
  accessCode,
  endDate,
  unit,
  variant,
  actionButton,
  containerProps,
  grade,
  roomKey,
  dueDate,
  actionLink,
  classroomDisplayName,
}: BaseCardProps) {
  return (
    <div
      data-testid={`${variant}-card`}
      className={classNames(
        containerProps?.className,
        cardTypeByVariant[variant].card,
        'relative flex h-auto flex-col rounded-md border border-gray-200 p-5 text-black'
      )}
      {...containerProps}
    >
      <div className="flex">
        <h5
          data-testid={`${variant}-card-display-name`}
          title={displayName}
          className={classNames(
            cardTypeByVariant[variant].displayName,
            'line-clamp-1 font-bold leading-5 text-gray-900'
          )}
        >
          {displayName}
        </h5>
      </div>
      <div className="flex items-center">
        {unit && (
          <p
            title={unit.toString()}
            className={classNames(cardTypeByVariant[variant].bodyInfo, 'pt-1')}
          >
            Unit: {unit}
          </p>
        )}
      </div>
      {grade && (
        <p
          title={grade.toString()}
          className={classNames(cardTypeByVariant[variant].bodyInfo, 'pt-1')}
        >
          Grade: {grade}
        </p>
      )}

      {variant === 'assignment' && (
        <>
          {classroomDisplayName && (
            <p
              title={classroomDisplayName.toString()}
              className={classNames(
                cardTypeByVariant[variant].bodyInfo,
                'pt-1'
              )}
            >
              Classroom: {classroomDisplayName}
            </p>
          )}
          {roomKey && (
            <p
              title={roomKey.toString()}
              className={classNames(
                cardTypeByVariant[variant].bodyInfo,
                ' pt-1'
              )}
            >
              Room code: {roomKey}
            </p>
          )}
          {dueDate && (
            <p
              title={dueDate.toString()}
              className={classNames(
                cardTypeByVariant[variant].bodyInfo,
                ' pt-1'
              )}
            >
              Due in: {dayjs(dueDate).diff(dayjs(), 'day')} days
            </p>
          )}
          <div className="mt-3 flex w-fit flex-row justify-between gap-2 ">
            {actionButton && (
              <Button
                color="primary"
                href={actionButton?.href}
                disabled={actionButton?.disabled}
              >
                {actionButton?.child}
              </Button>
            )}

            {actionLink && (
              <Button color="primary" href={actionLink?.href}>
                {actionLink?.child}
              </Button>
            )}
          </div>
        </>
      )}
      {variant === 'classroom' && (
        <>
          {accessCode && (
            <p
              title={accessCode.toString()}
              className={classNames(
                cardTypeByVariant[variant].bodyInfo,
                'pt-1'
              )}
            >
              Class Code: {accessCode.toUpperCase()}
            </p>
          )}
          {roomKey && (
            <p
              title={roomKey.toString()}
              className={classNames(
                cardTypeByVariant[variant].bodyInfo,
                ' pt-1'
              )}
            >
              Room code: {roomKey}
            </p>
          )}
          {endDate && (
            <p
              title={dayjs(endDate).format('MM D, YYYY')}
              className={classNames(
                cardTypeByVariant[variant].bodyInfo,
                ' pt-1'
              )}
            >
              Ends At: {dayjs(endDate).format('MMM D, YYYY')}
            </p>
          )}
          <div className="mt-3 flex max-w-full flex-row justify-between gap-2 w-fit">
            {actionButton && (
              <Button
                color="primary"
                shallow
                href={actionButton?.href}
                EndIcon={FiArrowRight}
                disabled={actionButton?.disabled}
              >
                {actionButton?.child}
              </Button>
            )}

            {actionLink && (
              <Button
                color="primary"
                href={actionLink?.href}
                EndIcon={FiArrowRight}
              >
                {actionLink?.child}
              </Button>
            )}
          </div>
        </>
      )}
      {/* <div className="max-w-44 absolute right-0 mr-4 flex flex-wrap justify-end gap-1">
        {icon && (
          <span className="flex items-center rounded-md bg-gray-100 px-2 py-1 text-sm font-normal text-gray-800">
            {icon}
          </span>
        )}
      </div> */}
    </div>
  );
}

export default Card;
