import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Routes } from 'lib/constants';
import axiosInstance from 'lib/react-query/axios';
import QueryKeys, { filterEmptyKeys } from 'lib/react-query/queryKeys';
import { GroupSetWithGroupsAndAssignmentsAndStudents } from 'types/models/GroupSet';

const getClassroomGroupSets = async (
  classroomId: string,
  activeOnly?: boolean
) => {
  const { data } = await axiosInstance.get<
    GroupSetWithGroupsAndAssignmentsAndStudents[]
  >(
    `${Routes.API.CLASSROOMS}/${classroomId}/groupsets${
      activeOnly ? '?activeOnly=true' : ''
    }`
  );
  return data;
};

export const useClassroomGroupSets = (
  classroomId: string,
  activeOnly?: boolean
) => {
  const query = useQuery<
    GroupSetWithGroupsAndAssignmentsAndStudents[],
    AxiosError
  >(
    filterEmptyKeys([QueryKeys.CLASSROOM_GROUPSETS, classroomId]),
    () => getClassroomGroupSets(classroomId, activeOnly),
    {
      enabled: !!classroomId,
    }
  );
  return query;
};
