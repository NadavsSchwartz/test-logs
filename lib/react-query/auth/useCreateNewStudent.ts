import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Routes } from 'lib/constants';
import axiosInstance from 'lib/react-query/axios';
import { ClientUser, StudentCreateFormData } from 'types/models/User';

const createNewStudent = async (
  studentDataWithClassroomAndTeacherId: StudentCreateFormData
) => {
  const { data } = await axiosInstance.post<ClientUser>(
    Routes.API.STUDENTS,
    studentDataWithClassroomAndTeacherId
  );
  return data;
};

export const useCreateNewStudent = () => {
  const mutation = useMutation<
    ClientUser,
    AxiosError,
    StudentCreateFormData,
    unknown
  >((studentDataWithClassroomAndTeacherId) =>
    createNewStudent(studentDataWithClassroomAndTeacherId)
  );

  return mutation;
};
