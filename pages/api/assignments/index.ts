import { authOptions } from '@/lib/auth';
import prisma from '@lib-server/prisma';
import {
  getAssignmentsByClassroomId,
  getAssignmentsByStudent,
  getAssignmentsByTeacher,
} from '@lib-server/services/assignments';
import ApiError from 'lib-server/error';
import { apiHandler } from 'lib-server/nc';
import {
  assignmentCreateSchema,
  assignmentQueryParamsSchema,
} from 'lib-server/validation';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { withValidation } from 'next-validations';
import { ClientUser } from 'types/models/User';

const handler = apiHandler();

const validateAssignmentTemplateCreate = withValidation({
  schema: assignmentCreateSchema,
  type: 'Zod',
  mode: 'body',
});

const validateAssignmentQueryParams = withValidation({
  schema: assignmentQueryParamsSchema,
  type: 'Zod',
  mode: 'query',
});

type GetUserAuthInfoRequest = NextApiRequest & {
  user: ClientUser;
};
async function generateUniqueRoomKey() {
  let roomKey = Math.random().toString(36).substring(7).toUpperCase();
  let assignment = await prisma.assignment.findFirst({ where: { roomKey } });

  while (assignment) {
    roomKey = Math.random().toString(36).substring(7).toUpperCase();
    assignment = await prisma.assignment.findFirst({ where: { roomKey } });
  }

  return roomKey;
}

handler.get(
  validateAssignmentQueryParams(),
  async (req: GetUserAuthInfoRequest, res: NextApiResponse) => {
    try {
      const session = await getServerSession(req, res, authOptions);
      if (!session) {
        throw new ApiError('Unauthorized', 401);
      }
      let assignments = [];
      if (session?.user?.role === 'STUDENT') {
        // get student assignments
        assignments = await getAssignmentsByStudent(
          session?.user?.id as string
        );
        return res.status(200).json(assignments);
      }
      const { classroomId } = req.query;
      if (classroomId) {
        assignments = await getAssignmentsByClassroomId({
          classroomId: classroomId as string,
        });
        return res.status(200).json(assignments);
      }
      assignments = await getAssignmentsByTeacher({
        teacherId: session?.user?.id as string,
      });

      return res.status(200).json(assignments);
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }
);

handler.post(
  validateAssignmentTemplateCreate(),
  async (req: GetUserAuthInfoRequest, res: NextApiResponse) => {
    try {
      const session = await getServerSession(req, res, authOptions);
      if (!session) {
        throw new ApiError('Unauthorized', 401);
      }
      const [groupSetData, taskData] = await Promise.all([
        prisma.groupSet.findUnique({
          where: { id: req?.body?.groupSetId.value },
          select: { groups: true },
        }),
        prisma.tasks.findUnique({ where: { id: req?.body?.taskId.value } }),
      ]);

      if (!taskData || !groupSetData || !groupSetData.groups)
        throw new ApiError(
          'Task or group set information couldn`t be retrieved',
          404
        );
      const groups = groupSetData.groups;

      const _assignmentsPromises = groups.map(async (group) => {
        const roomKey = await generateUniqueRoomKey();

        return {
          displayName: req.body.displayName,
          dueAt: req.body.dueAt,
          unit: taskData.unit,
          grade: taskData.grade,
          educatorDescription: taskData.notebookDescription ?? '',
          notebookDescription: taskData.notebookSummary ?? '',
          createdBy: session?.user?.id as string,
          classroomId: req.body.classroomId,
          groupId: group.id,
          roomKey: roomKey,
        };
      });

      const _assignments = await Promise.all(_assignmentsPromises);

      await prisma.assignmentSet.create({
        data: {
          assignment: {
            createMany: {
              data: _assignments,
            },
          },
          classroomId: req.body.classroomId,
        },
      });

      return res.status(201).json(_assignments);
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: `Something went wrong, ${error.message}` });
    }
  }
);

export default handler;
