import { GroupSet } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Routes } from 'lib/constants';
import axiosInstance from 'lib/react-query/axios';
import { GroupSetCreateFormData } from 'types/models/GroupSet';
import QueryKeys from '../queryKeys';

const createGroupSet = async (groupsetData: GroupSetCreateFormData) => {
  const { data } = await axiosInstance.post<GroupSet>(
    Routes.API.GROUPSETS.replace(':classroomId', groupsetData.classroomId),
    groupsetData
  );
  return data;
};

export const useCreateGroupSet = (classroomId: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    GroupSet,
    AxiosError,
    GroupSetCreateFormData,
    unknown
  >((data) => createGroupSet(data), {
    onSuccess: async () => {
      queryClient.invalidateQueries([
        QueryKeys.CLASSROOM_GROUPSETS,
        classroomId,
      ]);
    },
  });

  return mutation;
};
