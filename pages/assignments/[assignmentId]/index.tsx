import { Redirects } from '@/lib/constants';

import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';

// dynamic import
import Shell from '@/components/Layout/Shell';
import SkeletonLoader from '@/components/Loading/SkeletonLoader';
import { Progress } from '@/components/Progress';
import { GroupAssignmentCard } from '@/lib/Assignments/groupAssignment';
import { calculateProgress } from '@/lib/Assignments/Progress';
import { SubtitleSkeleton } from '@/lib/Assignments/Skeletons';
import { authOptions } from '@/lib/auth';
import { useAssignments } from '@/lib/react-query/assignments/useAssignments';
import QueryKeys, { filterEmptyKeys } from '@/lib/react-query/queryKeys';
import { ssrNcHandler } from '@lib-server/nc';
import {
  getAssignmentLogData,
  getAssignmentPageData,
} from '@lib-server/services/assignments';
import dayjs from 'dayjs';
import { getServerSession } from 'next-auth/next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import {
  AssignmentSetLogData,
  AssignmentSetPageData,
} from 'types/models/Assignment';

const Log = dynamic(() => import('@/components/Modals/assignmentLogModal'));

const AssignmentViewPage = () => {
  const router = useRouter();
  const query = router.query;
  const { assignmentId, assignmentSetId } = query as {
    assignmentId: string;
    assignmentSetId: string;
  };
  const {
    data: assignmentDetails,
    isLoading: isLoadingAssignmentDetails,
    isFetching: isFetchingAssignmentDetails,
  } = useAssignments({
    assignmentId,
    assignmentSetId,
  });

  const isLoading = isLoadingAssignmentDetails || isFetchingAssignmentDetails;



  const subtitle = useMemo(() => {
    return isLoading && !assignmentDetails ? (
      <SubtitleSkeleton />
    ) : (
      <div className="hidden sm:grid">
        <div>Classroom: {assignmentDetails?.classroom?.displayName}</div>
        <div>Unit: {assignmentDetails?.assignment?.[0]?.unit}</div>
        <div>Grade: {assignmentDetails?.assignment?.[0]?.grade}</div>
        <div>
          Due:{' '}
          {dayjs(assignmentDetails?.assignment?.[0]?.dueAt).format(
            'MMM DD, YYYY'
          )}
        </div>
        <div className="py-2">
          <div className="text-black font-bold">{'Assignment Details'}</div>
          <span>
            {' '}
            {assignmentDetails?.assignment?.[0]?.educatorDescription}
          </span>
        </div>
      </div>
    );
  }, [isLoading, assignmentDetails]);

  const sizeOfGroups = assignmentDetails?.assignment?.length;
  const sizeOfCompletedGroups = assignmentDetails?.assignment?.filter(
    (assignment) => !assignment.active
  ).length;

  const progress = useMemo(
    () => calculateProgress(sizeOfCompletedGroups ?? 0, sizeOfGroups ?? 0),
    [sizeOfGroups, sizeOfCompletedGroups]
  );

  return (
    <Shell
      backPath={`/assignments`}
      heading={assignmentDetails?.assignment?.[0]?.displayName}
      subtitle={subtitle}
    >
      {isLoading && !assignmentDetails ? (
        <SkeletonLoader />
      ) : (
        <div className="flex flex-col gap-4 px-2 sm:px-4 md:px-12">
          <div className="w-full flex flex-col">
            <div className="flex justify-end text-sm">
              {sizeOfCompletedGroups}/{sizeOfGroups} Groups Completed
            </div>
            <div className="flex justify-end">
              <Progress value={progress} className="w-60" />
            </div>
          </div>
          <div className="grid gap-3 grid-cols-1 lg:grid-cols-3 sm:grid-cols-2">
            {assignmentDetails?.assignment?.map((assignment) => (
              <GroupAssignmentCard
                displayName={assignment?.group?.displayName}
                key={assignment.id}
                students={assignment?.group?.students}
                roomKey={assignment.roomKey}
                timeInRoom="06:33"
                status={assignment.active ? 'in-progress' : 'submitted'}
                teamReport={{
                  href: `/assignments/${assignment.id}/groups`,
                  child: 'Team  ',
                }}
                studentReport={{
                  href: `/assignments/${assignment.id}/students`,
                  child: 'Student  ',
                }}
              />
            ))}
          </div>
        </div>
      )}
      <div className="hidden sm:flex">
        <Log assignmentSetId={assignmentSetId} assignmentId={assignmentId} />
      </div>
    </Shell>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) return Redirects.LOGIN;

  const assignmentId = query.assignmentId as string;
  const assignmentSetId = query.assignmentSetId as string;
  const queryClient = new QueryClient();

  const callback2 = async () =>
    await getAssignmentPageData({ assignmentSetId });

  const activeAssignments = await ssrNcHandler<AssignmentSetPageData>(
    req,
    res,
    callback2
  );



  const callback3 = async () =>
    await getAssignmentLogData({
      assignmentSetId,
      page: 0,
      filters: {
        selectedTeams: [],
        selectedActivityTypes: [
          'kudos',
          'feelingsTracker',
          'engineeringNotebookSteps',
        ],
        selectedStudents: [],
      },
    });

  const assignmentLogs = await ssrNcHandler<AssignmentSetLogData>(
    req,
    res,
    callback3
  );

  await queryClient.prefetchQuery(
    filterEmptyKeys([QueryKeys.ASSIGNMENT_DETAILS, assignmentSetId]),
    () => activeAssignments
  );
  await queryClient.prefetchInfiniteQuery(
    filterEmptyKeys([QueryKeys.ASSIGNMENT_LOG, assignmentSetId, assignmentId]),
    () => assignmentLogs
  );
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
export default AssignmentViewPage;
