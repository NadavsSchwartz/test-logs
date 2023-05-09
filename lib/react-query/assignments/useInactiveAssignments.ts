import { Assignment } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Routes } from 'lib/constants';
import axiosInstance from 'lib/react-query/axios';
import QueryKeys, { filterEmptyKeys } from 'lib/react-query/queryKeys';

const getInactiveAssignments = async (classroomId: string) => {
  const { data } = await axiosInstance.get<Assignment[]>(
    Routes.API.INACTIVE_ASSIGNMENTS.replace(':classroomId', classroomId)
  );
  return data;
};

export const useInactiveAssignments = (classroomId: string) => {
  const query = useQuery<Assignment[], AxiosError>(
    // key must match getServerSideProps or hydration error
    filterEmptyKeys([QueryKeys.INACTIVE_ASSIGNMENTS, classroomId]),
    () => getInactiveAssignments(classroomId),
    {
      cacheTime: 1000 * 60 * 60 * 1, // 1 hour
      enabled: !!classroomId,
    }
  );

  return query;
};
