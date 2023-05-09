import { WEBAPP_URL } from '@/lib/constants';

export const isBrowser = () => typeof window !== 'undefined';

export function isCharacterALetter(char: string) {
  return /[a-zA-Z]/.test(char);
}

//get month and day
export const getMonthAndDay = () => {
  const date = new Date();
  const month = date.toLocaleString('default', { month: 'long' });
  const day = date.getDate();
  return `${month} ${day}`;
};

export const getMinDateOfCurrentYear = () => {
  // get format of 2021-01-01
  const date = new Date();
  const year = date.getFullYear();
  return `${year}-01-01`;
};

export const isUrl = (str: string) => {
  return /^https?:\/\//gi.test(str);
};

// remove day from start and end date
export const removeDayFromDate = (date: string) => {
  const trimmedDate = date.split('T')[0];
  const [year, month] = trimmedDate.split('-');
  return `${year}/${month}`;
};

export const generateUniversalLink = ({
  assignmentId,
  studentId,
}: {
  assignmentId?: string;
  studentId?: string;
}) => {
  const constructedUniversalLink = new URL(
    `${WEBAPP_URL}/api/game-services/open`
  );
  assignmentId &&
    constructedUniversalLink.searchParams.append('assignmentId', assignmentId);
  studentId &&
    constructedUniversalLink.searchParams.append('studentId', studentId);
  return constructedUniversalLink.toString();
};
