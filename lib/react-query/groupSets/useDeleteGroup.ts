import { Routes } from '@/lib/constants';
import { GroupSet } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import axiosInstance from '../axios';
import QueryKeys from '../queryKeys';

const deleteGroup = async (
  classroomId: string,
  groupsetId: string,
  groupId: string
) => {
  const url = Routes.API.GROUP.replace(':classroomId', classroomId).replace(
    ':groupId',
    groupId
  );
  const { data } = await axiosInstance.delete<GroupSet>(url, {
    data: { groupsetId },
  });
  return data;
};

export const useDeleteGroup = (classroomId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<GroupSet, AxiosError, any, unknown>(
    ({ groupsetId, groupId }) => deleteGroup(classroomId, groupsetId, groupId),
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
