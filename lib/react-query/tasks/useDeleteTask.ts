import { Routes } from '@/lib/constants';
import { Tasks } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import axiosInstance from '../axios';
import QueryKeys from '../queryKeys';

const deleteTask = async (id: string) => {
  const { data } = await axiosInstance.delete<Tasks>(
    `${Routes.API.TASKS}/${id}`
  );
  return data;
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Tasks, AxiosError, string, unknown>(
    (id) => deleteTask(id),
    {
      onSuccess: async (data) => {
        await Promise.all([
          queryClient.invalidateQueries([QueryKeys.TASKS_HOME]),
          queryClient.invalidateQueries([QueryKeys.TASK, data.id]),
        ]);
      },
    }
  );

  return mutation;
};
