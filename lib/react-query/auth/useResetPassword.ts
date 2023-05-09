import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Routes } from 'lib/constants';
import axiosInstance from 'lib/react-query/axios';
import { UserResetPasswordData } from 'types/models/User';

const resetPassword = async ({
  requestId,
  password,
}: UserResetPasswordData) => {
  const { data } = await axiosInstance.post(Routes.API.RESET_PASSWORD, {
    requestId,
    password,
  });

  return data;
};

export const useResetPassword = () => {
  const mutation = useMutation<
    { message?: string },
    AxiosError,
    UserResetPasswordData,
    unknown
  >((data) => resetPassword(data));

  return mutation;
};
