import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Routes } from 'lib/constants';
import axiosInstance from 'lib/react-query/axios';
import { ClientUser, UserCreateData } from 'types/models/User';

const createUser = async (user: UserCreateData) => {
  const { data } = await axiosInstance.post<ClientUser>(Routes.API.USERS, user);
  return data;
};

export const useCreateUser = () => {
  const mutation = useMutation<ClientUser, AxiosError, UserCreateData, unknown>(
    (data) => createUser(data)
  );

  return mutation;
};
