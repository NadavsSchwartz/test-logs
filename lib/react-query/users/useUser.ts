import { Routes } from '@/lib/constants';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ClientUser } from 'types/models/User';
import axiosInstance from '../axios';
import QueryKeys, { filterEmptyKeys } from '../queryKeys';

const getUser = async (userId: string) => {
  const url = Routes.API.PROFILE.replace(':id', userId);
  const { data } = await axiosInstance.get<ClientUser>(url);
  return data;
};

export const useUser = (
  userId: string
): UseQueryResult<ClientUser, Error> & { refetch: () => void } => {
  const query = useQuery<ClientUser, AxiosError>(
    filterEmptyKeys([QueryKeys.ME, userId]),
    () => getUser(userId),
    { enabled: !!userId, staleTime: 1000 * 60 * 60 * 1 }
  );
  return query;
};
