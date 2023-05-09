import ApiError from '@lib-server/error';
import { getAssignmentLogData } from '@lib-server/services/assignments';
import { apiHandler } from 'lib-server/nc';
import { assignmentIdWithClassroomIdQueryParamsSchema } from 'lib-server/validation';
import type { NextApiRequest, NextApiResponse } from 'next';
import { withValidation } from 'next-validations';

const handler = apiHandler();

const validateAssignmentQueryParams = withValidation({
  schema: assignmentIdWithClassroomIdQueryParamsSchema,
  type: 'Zod',
  mode: 'query',
});

handler.get(
  validateAssignmentQueryParams(),
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { assignmentId, assignmentSetId, page = 0, filters } = req.query;
    if (!assignmentSetId) {
      throw new ApiError('Missing assignmentSetId', 400);
    }
    const parsedFilters =
      filters !== 'undefined' ? JSON.parse(filters as string) : {};
    console.log('parsedFilters', parsedFilters);
    const logs = await getAssignmentLogData({
      assignmentId: assignmentId as string,
      assignmentSetId: assignmentSetId as string,
      page: parseInt(page as string),
      filters: parsedFilters,
    });

    return res.status(200).json(logs);
  }
);

export default handler;
