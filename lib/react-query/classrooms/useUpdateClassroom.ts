import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Routes } from 'lib/constants';
import axiosInstance from 'lib/react-query/axios';
import { ClassroomUpdateFormData } from 'types/models/Classroom';
import { ClientUser } from 'types/models/User';

const updateClassroom = async (
  classroomData: ClassroomUpdateFormData,
  classroomId: string
) => {
  const { data } = await axiosInstance.put<ClientUser>(
    `${Routes.API.CLASSROOMS}/${classroomId}`,
    classroomData
  );
  return data;
};

export const useUpdateClassroom = (classroomId: string) => {
  const mutation = useMutation<
    ClientUser,
    AxiosError,
    ClassroomUpdateFormData,
    unknown
  >((data: ClassroomUpdateFormData) => updateClassroom(data, classroomId));

  return mutation;
};
