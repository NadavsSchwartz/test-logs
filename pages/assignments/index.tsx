import Card from '@/components/Cards';
import EmptyScreen from '@/components/EmptyScreen';
import Shell from '@/components/Layout/Shell';
import Spinner from '@/components/Loading/Spinner';
import { authOptions } from '@/lib/auth';
import { Redirects } from '@/lib/constants';
import { useActiveAssignments } from '@/lib/react-query/assignments/useActiveAssignments';
import QueryKeys, { filterEmptyKeys } from '@/lib/react-query/queryKeys';
import { generateUniversalLink } from '@/utility/index';
import { ssrNcHandler } from '@lib-server/nc';
import {
  getAssignmentsByStudent,
  getAssignmentsByTeacher,
} from '@lib-server/services/assignments';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { useSession } from 'next-auth/react';
import { ClientUser } from 'types/models/User';

const ActiveAassignmentsPage = () => {
  const { data: session, status } = useSession();

  const user = session?.user as ClientUser;
  const { data, isLoading: isLoadingFetchingActiveAssignments } =
    useActiveAssignments(user?.id);
  const isLoading = status === 'loading' || isLoadingFetchingActiveAssignments;
  return (
    <Shell
      heading="Active Assignments"
      subtitle={'Your Assignments across all classrooms.'}
    >
      <div>
        {isLoading ? (
          <Spinner />
        ) : !data?.length ? (
          <EmptyScreen
            headline="No active Assignments"
            description="You don't have any active Assignments."
          />
        ) : (
          <div className="grid gap-3 lg:grid-cols-4 [@media(max-width:1270px)]:grid-cols-3 [@media(max-width:730px)]:grid-cols-2 @media(max-width:500px):grid-cols-1 p-1">
            {data?.map((assignment) => (
              <div key={assignment?.id}>
                <Card
                  displayName={assignment?.displayName}
                  unit={assignment?.unit}
                  variant="assignment"
                  actionLink={
                    user.role === 'STUDENT'
                      ? {
                          href: `${generateUniversalLink({
                            assignmentId: assignment.id,
                            studentId: session?.user?.id,
                          })}`,
                          child: 'Launch Game',
                        }
                      : {
                          href: `/assignments/${assignment?.id}?assignmentSetId=${assignment?.assignmentSetId}`,
                          child: 'View Assignment',
                        }
                  }
                  grade={assignment?.grade as string}
                  roomKey={assignment?.roomKey}
                  dueDate={assignment?.dueAt}
                  classroomDisplayName={assignment?.classroom?.displayName}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </Shell>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) return Redirects.LOGIN;
  const user = session.user as ClientUser;

  const queryClient = new QueryClient();
  if (user?.role === 'STUDENT') {
    const callback = async () => await getAssignmentsByStudent(user.id);
    const activeAssignments = await ssrNcHandler<any[]>(req, res, callback);
    await queryClient.prefetchQuery(
      filterEmptyKeys([QueryKeys.ACTIVE_ASSIGNMENTS, user?.id]),
      () => activeAssignments
    );
  } else {
    const callback = async () =>
      await getAssignmentsByTeacher({ teacherId: user.id });
    const teacherActiveAssignments = await ssrNcHandler<any[]>(
      req,
      res,
      callback
    );
    await queryClient.prefetchQuery(
      filterEmptyKeys([QueryKeys.ACTIVE_ASSIGNMENTS, user?.id]),
      () => teacherActiveAssignments
    );
  }
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
export default ActiveAassignmentsPage;
