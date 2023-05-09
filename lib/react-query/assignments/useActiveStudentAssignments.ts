import { Assignment } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Routes } from 'lib/constants';
import axiosInstance from 'lib/react-query/axios';
import QueryKeys, { filterEmptyKeys } from 'lib/react-query/queryKeys';

const getStudentActiveAssignments = async () => {
  const { data } = await axiosInstance.get<Assignment[]>(
    `${Routes.API.ASSIGNMENTS}?active=true`
  );
  return data;
};

export const useStudentActiveAssignments = (studentId: string) => {
  const query = useQuery<Assignment[], AxiosError>(
    // key must match getServerSideProps or hydration error
    filterEmptyKeys([QueryKeys.ACTIVE_ASSIGNMENTS, studentId]),
    () => getStudentActiveAssignments(),
    {
      enabled: !!studentId,
      staleTime: 1000 * 60 * 60 * 5, // 5 hours
    }
  );

  return query;
};
