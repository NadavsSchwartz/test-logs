import { FeelingType } from '@prisma/client';
import dayjs from 'dayjs';

import relativeTime from 'dayjs/plugin/relativeTime';
import React from 'react';
import { FiTarget } from 'react-icons/fi';
import { GoSearch } from 'react-icons/go';
import { HiOutlineCloud, HiOutlineFaceSmile, HiUsers } from 'react-icons/hi2';
import { IoContract } from 'react-icons/io5';

dayjs.extend(relativeTime);
interface Student {
  id: string;
  firstName: string;
  lastName: string;
}

interface EngineeringNotebookStepProps {
  step: {
    id: string;
    createdAt: Date;
    data: string;
    action: string;
    iteration: number;
    field: string;
    page: string;
    student: Student;
  };
}
type Field =
  | 'objectives'
  | 'constraints'
  | 'idea'
  | 'feeling'
  | 'confused'
  | 'observe'
  | 'explain'
  | 'modify';

const setNotebookStepIcon = (field: Field) => {
  switch (field) {
    case 'objectives':
      return (
        <FiTarget
          size={22}
          className="p-0.5 text-gray-700 border-gray-700 border rounded-xl"
        />
      );
    case 'constraints':
      return (
        <IoContract
          size={24}
          className="text-blue-700 border-blue-700 border rounded-xl p-0.5"
        />
      );
    case 'idea':
    case 'feeling':
    case 'confused':
    case 'observe':
    case 'explain':
    case 'modify':
      return (
        <HiOutlineCloud
          size={24}
          className="text-red-700 border-red-700 border rounded-xl p-0.5"
        />
      );
    default:
      return (
        <GoSearch
          size={24}
          className="text-orange-700 border-orange-700 border rounded-xl p-0.5"
        />
      );
  }
};

const Wrapper: React.FC<{
  student: Student;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ student, icon, children }) => {
  return (
    <>
      <div className="flex text-sm font-semibold justify-between relative">
        <span className="pl-2 text-gray-700">{student?.firstName}</span>
        <span className="text-xs m-1 absolute top-3/4 right-2 transform -translate-y-1/2 rounded-full bg-white">
          <span>{icon}</span>
        </span>
      </div>
      {children}
    </>
  );
};

export const EngineeringNotebookStep: React.FC<EngineeringNotebookStepProps> =
  React.memo(({ step }) => {
    return (
      <Wrapper
        student={step.student}
        icon={setNotebookStepIcon(step.field as Field)}
      >
        <div
          className={`flex justify-between items-center px-2 py-3 bg-white border-1 shadow-md rounded-lg line-clamp-2`}
        >
          {step.data}
        </div>

        <div className="ml-2 text-xs text-gray-400">
          {dayjs(step.createdAt).fromNow()}
        </div>
      </Wrapper>
    );
  });

interface FeelingsTrackerProps {
  feeling: {
    id: string;
    type: FeelingType;
    createdAt: Date;
    student: Student;
  };
}

const getFeelingColor = (type: keyof typeof FeelingType): string => {
  switch (type) {
    case 'HAPPY':
      return 'bg-green-500';
    case 'CALM':
      return 'bg-blue-500';
    case 'FOCUSED':
      return 'bg-indigo-500';
    case 'READYTOLEARN':
      return 'bg-purple-500';
    case 'SAD':
      return 'bg-blue-300';
    case 'SICK':
      return 'bg-gray-300';
    case 'WITHDRAWN':
      return 'bg-gray-500';
    case 'TIRED':
      return 'bg-yellow-300';
    case 'FRUSTRATED':
      return 'bg-red-400';
    case 'WORRIED':
      return 'bg-orange-400';
    case 'SILLY':
      return 'bg-pink-400';
    case 'EXCITED':
      return 'bg-yellow-500';
    case 'MAD':
      return 'bg-red-500';
    case 'TERRIFIED':
      return 'bg-orange-500';
    case 'YELLING':
      return 'bg-red-600';
    case 'FURIOUS':
      return 'bg-red-700';
    default:
      return 'bg-gray-400';
  }
};

const FeelingIcon: React.FC<{ type: FeelingType }> = ({ type }) => {
  return (
    <HiOutlineFaceSmile
      size={22}
      className={`rounded-xl text-green-800 border border-green-800 p-0.5`}
    />
  );
};

export const FeelingsTracker: React.FC<FeelingsTrackerProps> = React.memo(
  ({ feeling }) => (
    <Wrapper
      student={feeling.student}
      icon={<FeelingIcon type={feeling.type} />}
    >
      <div className="flex justify-between items-center px-2 py-3 bg-white border-1 shadow-md rounded-lg">
        <div className="flex items-center ml-2 align-middle">
          <div className="text-sm text-gray-500 font-bold capitalize">
            {feeling.type.toLowerCase()}
          </div>

          <span
            className={`w-3.5 h-3.5 rounded-full ml-1 ${getFeelingColor(
              feeling.type
            )}`}
          />
        </div>
      </div>
      <div className="ml-2 text-xs text-gray-400">
        {dayjs(feeling.createdAt).fromNow()}
      </div>
    </Wrapper>
  )
);

interface KudosProps {
  kudo: {
    id: string;
    createdAt: Date;
    type: string;
    isPositive: boolean;
    sender: Student;
    receiver: Student;
  };
}

const KudosIcon: React.FC<{ isPositive: boolean }> = ({ isPositive }) => (
  <HiUsers
    size={22}
    className={`rounded-xl p-0.5 text-purple-500 border border-purple-500`}
  />
);

export const Kudos: React.FC<KudosProps> = React.memo(({ kudo }) => (
  <Wrapper
    student={kudo.sender}
    icon={<KudosIcon isPositive={kudo.isPositive} />}
  >
    <div className="p-3 bg-white border-1 rounded-xl shadow-sm text-sm text-gray-500">
      <span className="text-gray-600 font-bold">{kudo.receiver.lastName} </span>
      Received{' '}
      <span
        className={`font-bold ${
          kudo.isPositive ? 'text-green-700' : 'text-red-700'
        }`}
      >
        {kudo.isPositive ? 'positive' : 'negative'}
      </span>{' '}
      kudo at{' '}
      <span className="capitalize">{kudo.type.toLocaleLowerCase()}</span>
    </div>
    <div className="ml-2 text-xs text-gray-400">
      {dayjs(kudo.createdAt).fromNow()}
    </div>
  </Wrapper>
));
