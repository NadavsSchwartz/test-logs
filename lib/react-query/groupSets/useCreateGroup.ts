import { Group } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Routes } from 'lib/constants';
import axiosInstance from 'lib/react-query/axios';
import { GroupCreateData } from 'types/models/Group';

const createGroup = async (groupData: GroupCreateData) => {
  const { data } = await axiosInstance.post<Group>(
    Routes.API.GROUPSET.replace(':classroomId', groupData.classroomId).replace(
      ':groupsetId',
      groupData.groupSetId
    ),
    groupData
  );
  return data;
};

export const useCreateGroup = () => {
  const mutation = useMutation<Group, AxiosError, GroupCreateData, unknown>(
    (data) => createGroup(data)
  );

  return mutation;
};
