import { useInfiniteQuery } from '@tanstack/react-query';
import { Routes } from 'lib/constants';
import axiosInstance from 'lib/react-query/axios';
import { AssignmentSetLogData } from 'types/models/Assignment';
import QueryKeys from '../queryKeys';

const fetchLogs = async ({
  assignmentId,
  assignmentSetId,
  pageParam = 0,
  filters,
}: {
  assignmentId: string;
  assignmentSetId: string;
  pageParam: number;
  filters: {
    selectedStudents: string[];
    selectedTeams: string[];
    selectedActivityTypes: string[];
  };
}) => {
  const params = new URLSearchParams();
  params.append('assignmentSetId', assignmentSetId);
  params.append('page', pageParam?.toString() || '0');
  params.append('filters', JSON.stringify(filters));

  const { data } = await axiosInstance.get<AssignmentSetLogData>(
    `${Routes.API.ASSIGNMENTS}/${assignmentId}/log?${params}`
  );

  return data;
};

const useInfiniteLogs = ({
  assignmentId,
  assignmentSetId,
  filters,
}: {
  assignmentId: string;
  assignmentSetId: string;
  filters: {
    selectedStudents: string[];
    selectedTeams: string[];
    selectedActivityTypes: string[];
  };
}) => {
  return useInfiniteQuery(
    [QueryKeys.ASSIGNMENT_LOG, assignmentSetId, assignmentId],
    async ({ pageParam }) =>
      await fetchLogs({ assignmentId, assignmentSetId, pageParam, filters }),
    {
      getNextPageParam: (lastPage) => {
        return lastPage?.hasNextPage ? lastPage.nextPage : false;
      },
    }
  );
};

export default useInfiniteLogs;
