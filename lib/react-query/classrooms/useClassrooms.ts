import { Classroom } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Routes } from 'lib/constants';
import axiosInstance from 'lib/react-query/axios';
import QueryKeys, { filterEmptyKeys } from 'lib/react-query/queryKeys';

const getClassroomsByTeacher = async () => {
  const { data } = await axiosInstance.get<Classroom[]>(Routes.API.CLASSROOMS);
  return data;
};

export const useClassrooms = (userId: string) => {
  const query = useQuery<Classroom[], AxiosError>(
    // key must match getServerSideProps or hydration error
    filterEmptyKeys([QueryKeys.CLASSROOMS_HOME, userId]),
    () => getClassroomsByTeacher(),
    {
      enabled: !!userId,
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    }
  );

  return query;
};
