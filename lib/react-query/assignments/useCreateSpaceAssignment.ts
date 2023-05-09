import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Routes } from 'lib/constants';
import axiosInstance from 'lib/react-query/axios';
import QueryKeys from 'lib/react-query/queryKeys';
import { AssignmentCreateData } from 'types/models/Assignment';
import { ClientUser } from 'types/models/User';

const createNewSpaceAssignment = async (
  newAssignmentData: AssignmentCreateData
) => {
  const { data } = await axiosInstance.post<ClientUser>(
    Routes.API.ASSIGNMENTS,
    newAssignmentData
  );
  return data;
};

export const useCreateNewSpaceAssignment = (teacherId: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    ClientUser,
    AxiosError,
    AssignmentCreateData,
    unknown
  >((newAssignmentData) => createNewSpaceAssignment(newAssignmentData), {
    onSuccess: async () => {
      await queryClient.invalidateQueries([
        QueryKeys.ACTIVE_ASSIGNMENTS,
        teacherId,
      ]);
    },
    onError: (error) => {
      return error;
    },
  });

  return mutation;
};
