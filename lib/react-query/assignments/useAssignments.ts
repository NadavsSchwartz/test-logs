import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Routes } from 'lib/constants';
import axiosInstance from 'lib/react-query/axios';
import QueryKeys, { filterEmptyKeys } from 'lib/react-query/queryKeys';
import { AssignmentSetPageData } from 'types/models/Assignment';

const getAssignments = async ({
  assignmentId,
  assignmentSetId,
}: {
  assignmentId: string;
  assignmentSetId: string;
}) => {
  const { data } = await axiosInstance.get<AssignmentSetPageData>(
    `${Routes.API.ASSIGNMENTS}/${assignmentId}?assignmentSetId=${assignmentSetId}`
  );

  return data;
};

export const useAssignments = ({
  assignmentId,
  assignmentSetId,
}: {
  assignmentId: string;
  assignmentSetId: string;
}) => {
  const query = useQuery<AssignmentSetPageData, AxiosError>(
    // key must match getServerSideProps or hydration error
    filterEmptyKeys([QueryKeys.ASSIGNMENT_DETAILS, assignmentSetId]),
    () => getAssignments({ assignmentId, assignmentSetId })
  );

  return query;
};
