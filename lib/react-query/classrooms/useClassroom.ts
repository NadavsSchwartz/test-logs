import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Routes } from 'lib/constants';
import axiosInstance from 'lib/react-query/axios';
import QueryKeys from 'lib/react-query/queryKeys';
import { ClassroomWithMembersAndAssignments } from 'types/models/Classroom';

const getClassroomById = async (classroomId: string) => {
  const { data } = await axiosInstance.get<ClassroomWithMembersAndAssignments>(
    `${Routes.API.CLASSROOMS}/${classroomId}`
  );
  return data;
};

export const useClassroom = (classroomId: string) => {
  const query = useQuery<ClassroomWithMembersAndAssignments, AxiosError>(
    [QueryKeys.CLASSROOM, classroomId],
    () => getClassroomById(classroomId),
    {
      enabled: !!classroomId,
    }
  );

  return query;
};
