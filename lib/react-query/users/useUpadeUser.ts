import { useMutation } from '@tanstack/react-query';
import { Routes } from 'lib/constants';
import axiosInstance from 'lib/react-query/axios';
import { ClientUser, UserUpdateMutationData } from 'types/models/User';

const updateUser = async ({ id, userData }: UserUpdateMutationData) => {
  const { data } = await axiosInstance.patch<ClientUser>(
    `${Routes.API.USERS}/${id}`,
    userData
  );
  return data;
};

export const useUpdateUser = () => {
  const mutation = useMutation<
    ClientUser,
    Error,
    UserUpdateMutationData,
    unknown
  >((data) => updateUser(data));

  return mutation;
};
