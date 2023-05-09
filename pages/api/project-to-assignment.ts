import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const projectId = req.query.projectId as string;
  const path = req.query.path as string[];

  // Replace this with the actual assignmentId mapping logic
  const assignmentId = projectId;

  const newPath = `/api/game-services/assignment/${assignmentId}/${path.join(
    '/'
  )}`;

  return res.redirect(newPath);
}
