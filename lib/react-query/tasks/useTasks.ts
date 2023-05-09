import { Tasks } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Routes } from 'lib/constants';
import axiosInstance from 'lib/react-query/axios';
import QueryKeys, { filterEmptyKeys } from 'lib/react-query/queryKeys';

const getTasksByTeacher = async () => {
  const { data } = await axiosInstance.get<Tasks[]>(Routes.API.TASKS);
  return data;
};

export const useTasks = (teacherId: string) => {
  const query = useQuery<Tasks[], AxiosError>(
    // key must match getServerSideProps or hydration error
    filterEmptyKeys([QueryKeys.TASKS, teacherId]),
    () => getTasksByTeacher(),
    {
      enabled: !!teacherId,
      staleTime: 1000 * 60 * 60 * 1, // 1 hours
    }
  );

  return query;
};
