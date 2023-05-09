import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Routes } from 'lib/constants';
import axiosInstance from 'lib/react-query/axios';
import QueryKeys, { filterEmptyKeys } from 'lib/react-query/queryKeys';
import { GroupWithMemebers } from 'types/models/Group';

const getClassroomGroups = async (classroomId: string) => {
  const { data } = await axiosInstance.get<GroupWithMemebers>(
    `${Routes.API.CLASSROOMS}/${classroomId}/groupsets`
  );
  return data;
};

export const useClassroomGroups = (classroomId: string) => {
  const query = useQuery<GroupWithMemebers, AxiosError>(
    filterEmptyKeys([QueryKeys.CLASSROOM_GROUPSETS]),
    () => getClassroomGroups(classroomId)
  );
  return query;
};
