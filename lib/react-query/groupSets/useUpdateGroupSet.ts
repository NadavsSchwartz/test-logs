import { Routes } from '@/lib/constants';
import { GroupSet } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { GroupSetForDragAndDrop } from 'types/models/GroupSet';
import axiosInstance from '../axios';
import QueryKeys from '../queryKeys';

const updateGroupSet = async (groupSet: GroupSetForDragAndDrop) => {
  const url = Routes.API.GROUPSET.replace(
    ':classroomId',
    groupSet.classroomId as string
  ).replace(':groupsetId', groupSet.id);
  const { data } = await axiosInstance.put<GroupSet>(url, {
    groupSet,
  });
  return data;
};

export const useUpdateGroupSet = (classroomId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<GroupSet, AxiosError, any, unknown>(
    (groupSet) => updateGroupSet(groupSet),
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
