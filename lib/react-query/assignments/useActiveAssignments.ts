import { Assignment } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Routes } from 'lib/constants';
import axiosInstance from 'lib/react-query/axios';
import QueryKeys, { filterEmptyKeys } from 'lib/react-query/queryKeys';

interface assignmentWithClassroomName extends Assignment {
  classroom: { id: string; displayName: string };
}

const getActiveAssignments = async (classroomId?: string) => {
  const { data } = await axiosInstance.get<assignmentWithClassroomName[]>(
    `${Routes.API.ASSIGNMENTS}?classroomId=${classroomId}`
  );
  return data;
};

export const useActiveAssignments = (userId: string, classroomId?: string) => {
  const query = useQuery<assignmentWithClassroomName[], AxiosError>(
    // key must match getServerSideProps or hydration error
    filterEmptyKeys([QueryKeys.ACTIVE_ASSIGNMENTS, userId]),
    () => getActiveAssignments(classroomId),
    {
      enabled: !!userId,
      staleTime: 1000 * 60 * 60 * 1, // 1 hours
      cacheTime: 1000 * 60 * 60 * 1, // 1 hours
    }
  );

  return query;
};
