import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Routes } from 'lib/constants';
import axiosInstance from 'lib/react-query/axios';
import { useRouter } from 'next/router';
import {
  ClassroomCreateData,
  ClassroomWithTeacher,
} from 'types/models/Classroom';
import QueryKeys from '../queryKeys';

const createClassroom = async (classroomData: ClassroomCreateData) => {
  const { data } = await axiosInstance.post<ClassroomWithTeacher>(
    Routes.API.CLASSROOMS,
    classroomData
  );
  return data;
};

export const useCreateClassroom = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation<
    ClassroomWithTeacher,
    AxiosError,
    ClassroomCreateData,
    unknown
  >((data) => createClassroom(data), {
    onSuccess: async () => {
      await queryClient.invalidateQueries([QueryKeys.CLASSROOMS]);
      await router.push(Routes.SITE.TEACHER_CLASSROOMS);
    },
  });

  return mutation;
};
