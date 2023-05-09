import { Tasks } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Routes } from 'lib/constants';
import axiosInstance from 'lib/react-query/axios';

import { TaskCreateData } from 'types/models/Assignment';
import QueryKeys from '../queryKeys';

const createTask = async (taskData: TaskCreateData) => {
  const { data } = await axiosInstance.post<Tasks>(Routes.API.TASKS, taskData);
  return data;
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Tasks, AxiosError, TaskCreateData, unknown>(
    (data) => createTask(data),
    {
      onSuccess: async () => {
        queryClient.invalidateQueries([QueryKeys.TASKS_HOME]);
      },
    }
  );

  return mutation;
};
