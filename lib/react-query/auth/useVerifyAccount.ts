import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Routes } from 'lib/constants';
import axiosInstance from 'lib/react-query/axios';
import { ClientUser } from 'types/models/User';

const verifyAccount = async (props: { token: string; userId: string }) => {
  const { data } = await axiosInstance.post<ClientUser>(
    Routes.API.VERIFY_ACCOUNT,
    {
      token: props.token,
      userId: props.userId,
    }
  );
  return data;
};

export const useVerifyAccount = () => {
  const mutation = useMutation<
    ClientUser,
    AxiosError,
    { token: string; userId: string },
    unknown
  >((data) => verifyAccount(data));

  return mutation;
};
