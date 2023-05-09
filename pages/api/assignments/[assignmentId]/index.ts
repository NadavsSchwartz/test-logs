import { getAssignmentPageData } from '@lib-server/services/assignments';
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
    const { assignmentSetId } = req.query;
    if (!assignmentSetId) {
      return res
        .status(400)
        .json({ error: 'Missing assignment or classroom id' });
    }
    const assignment = await getAssignmentPageData({
      assignmentSetId,
    } as {
      assignmentSetId: string;
    });
    return res.status(200).json(assignment);
  }
);

export default handler;
