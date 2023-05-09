import { classNames } from '@/utility/className';
import type { ReactNode } from 'react';
import React from 'react';
import Button from '../../components/Button';

export type BaseCardProps = {
  displayName: string;
  students: {
    email: string | null;
    firstName: string;
    lastName: string;
    id: string;
  }[];

  containerProps?: JSX.IntrinsicElements['div'];
  teamReport?: {
    href: string;
    child: ReactNode;
  };
  studentReport?: {
    href: string;
    child: ReactNode;
  };
  actionButton?: {
    href?: string;
    child: ReactNode;
    onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    disabled?: boolean;
  };
  roomKey?: string;
  timeInRoom?: string;
  status: 'submitted' | 'in-progress';
};

export function GroupAssignmentCard({
  displayName,
  timeInRoom,
  students,
  containerProps,
  teamReport,
  roomKey,
  studentReport,
  status,
}: BaseCardProps) {
  return (
    <>
      <div
        data-testid={`group-assignment-card`}
        className={classNames(
          containerProps?.className,
          'relative flex h-auto flex-col rounded-lg border capitalize truncate'
        )}
        {...containerProps}
      >
        <div className="flex flex-col p-4 bg-slate-100 rounded-t-lg">
          <h5
            data-testid={`group-assignment-card-display-name`}
            title={displayName}
            className={'line-clamp-1 font-bold leading-5 text-sm'}
          >
            {displayName}
          </h5>

          <p className="font-bold">
            {students?.length > 0
              ? students.map((student) => student.firstName).join(', ')
              : 'No students in group'}
          </p>
        </div>
        <div className="flex flex-col p-4">
          {roomKey && (
            <p
              title={roomKey.toString()}
              className={
                'text-sm leading-[18px] text-gray-500 font-normal pt-1'
              }
            >
              Room code: {roomKey}
            </p>
          )}
          {timeInRoom && (
            <p
              title={timeInRoom.toString()}
              className={
                'text-sm leading-[18px] text-gray-500 font-normal pt-1'
              }
            >
              Time in room: {timeInRoom}
            </p>
          )}
          {status && (
            <p
              title={status.toString()}
              className={` uppercase leading-[18px] font-bold pt-1 ${
                status === 'submitted' ? 'text-green-500' : 'text-yellow-500'
              }`}
            >
              {status}
            </p>
          )}
        </div>
        <div className=" flex flex-col w-fit justify-between px-4 py-2  ">
          {status === 'submitted' ? (
            <>
              <p
                title={status.toString()}
                className={`text-gray-500 leading-[18px] font-bold `}
              >
                {'Submittion Reports'}
              </p>
              <div className="flex gap-1 py-1">
                {teamReport && (
                  <Button
                    color="minimal"
                    size={'base'}
                    className="border max-h-6"
                    href={teamReport?.href}
                  >
                    {teamReport?.child}
                  </Button>
                )}
                {studentReport && (
                  <Button
                    color="minimal"
                    href={studentReport?.href}
                    size={'base'}
                    className="border max-h-6"
                  >
                    {studentReport?.child}
                  </Button>
                )}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default GroupAssignmentCard;
