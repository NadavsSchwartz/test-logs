import { Routes } from '@/lib/constants';
import { GroupSet } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import axiosInstance from '../axios';
import QueryKeys from '../queryKeys';

const deleteGroupSet = async (classroomId: string, groupId: string) => {
  const url = Routes.API.GROUPSET.replace(':classroomId', classroomId)
    .replace(':groupId', groupId)
    .replace(':groupsetId', groupId);
  const { data } = await axiosInstance.delete<GroupSet>(url);
  return data;
};

export const useDeleteGroupSet = (classroomId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<GroupSet, AxiosError, string, unknown>(
    (groupId) => deleteGroupSet(classroomId, groupId),
    {
      onSuccess: async () => {
        queryClient.invalidateQueries([
          QueryKeys.CLASSROOM_GROUPSETS,
          classroomId,
        ]);
      },
    }
  );

  return mutation;
};
