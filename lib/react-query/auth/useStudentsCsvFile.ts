import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Routes } from 'lib/constants';
import axiosInstance from 'lib/react-query/axios';
import { studentsFromCsvFile } from 'pages/api/students/csv';
import { ClientUser } from 'types/models/User';

interface studentCreateService {
  students: studentsFromCsvFile[];
  classroomId: string;
  teacherId: string;
}

const uploadStudentsCsvFile = async ({
  students,
  classroomId,
  teacherId,
}: studentCreateService) => {
  const { data } = await axiosInstance.post<ClientUser>(
    `${Routes.API.STUDENTS}/csv`,
    { students, classroomId, teacherId }
  );
  return data;
};

export const useStudentsCsvFile = () => {
  const mutation = useMutation<
    ClientUser,
    AxiosError,
    studentCreateService,
    unknown
  >(({ students, classroomId, teacherId }) =>
    uploadStudentsCsvFile({ students, classroomId, teacherId })
  );

  return mutation;
};
