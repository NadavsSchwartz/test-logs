import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Routes } from 'lib/constants';
import axiosInstance from 'lib/react-query/axios';
import QueryKeys, { filterEmptyKeys } from 'lib/react-query/queryKeys';
import { ClassroomStudentManagement } from 'types/models/User';

const getStudentsForClassroom = async (classroomId: string) => {
  const { data } = await axiosInstance.get<ClassroomStudentManagement[]>(
    Routes.API.CLASSROOM_MEMBERS.replace(':classroomId', classroomId)
  );
  return data;
};

export const useStudentsForClassroom = (classroomId: string) => {
  const query = useQuery<ClassroomStudentManagement[], AxiosError>(
    filterEmptyKeys([QueryKeys.CLASSSROOM_STUDENT_MANAGEMENT, classroomId]),
    () => getStudentsForClassroom(classroomId)
  );
  return query;
};
