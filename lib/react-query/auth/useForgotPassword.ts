import { useMutation } from '@tanstack/react-query';
import { Routes } from 'lib/constants';
import axiosInstance from 'lib/react-query/axios';

const forgotPassword = async (email: string) => {
  const { data } = await axiosInstance.post<{
    message?: string;
  }>(Routes.API.FORGOT_PASSWORD, { email: email });

  return data;
};

export const useForgotPassword = () => {
  const mutation = useMutation<{ message?: string }, Error, string, unknown>(
    (data) => forgotPassword(data)
  );

  return mutation;
};
