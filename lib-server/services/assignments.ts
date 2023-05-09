import { Assignment, AssignmentSet, Grade } from '@prisma/client';
import ApiError from 'lib-server/error';
import prisma from 'lib-server/prisma';
import {
  AssignmentGetData,
  AssignmentSetLogData,
  AssignmentSetPageData,
  AssignmentUpdateFormData,
} from 'types/models/Assignment';

// ---------- pages/api/assignments.ts ----------

export const createAssignment = async ({
  displayName,
  grade,
  dueAt,
  unit,
  educatorDescription,
  notebookDescription,
  createdBy,
  classroomId,
  groupId,
  roomKey,
}: {
  displayName: string;
  grade: Grade;
  dueAt: Date;
  unit: string;
  educatorDescription: string;
  notebookDescription: string;
  createdBy: string;
  classroomId: string;
  groupId: string;
  roomKey: string;
}): Promise<Assignment> => {
  try {
    const assignment = await prisma.assignment.create({
      data: {
        displayName,
        dueAt,
        educatorDescription,
        notebookDescription,
        grade,
        unit,
        createdBy,
        classroomId,
        groupId,
        roomKey,
        active: true,
      },
    });

    if (!assignment) throw new ApiError('Assignment not created', 400);

    return assignment;
  } catch (error: any) {
    console.log('error creating assignment', error);
    throw new ApiError('Assignment not created', 400);
  }
};

export const getAssignmentsByClassroomId = async ({
  classroomId,
}: {
  classroomId?: string;
}): Promise<Assignment[]> => {
  try {
    const assignmentSet = await prisma.assignmentSet.findMany({
      where: {
        classroomId,
      },
      select: {
        assignment: {
          select: {
            id: true,
            displayName: true,
            dueAt: true,
            educatorDescription: true,
            notebookDescription: true,
            grade: true,
            unit: true,
            createdBy: true,
            groupId: true,
            roomKey: true,
            active: true,
            assignmentSetId: true,
            updatedAt: true,
            createdAt: true,
            updatedBy: true,
            classroomId: true,
            classroom: {
              select: {
                id: true,
                displayName: true,
              },
            },
          },
          where: { active: true },
          take: 1,
          orderBy: { dueAt: 'desc' },
        },
      },
    });
    const assignmentSetResult = assignmentSet.flatMap((assignmentSet) => {
      return assignmentSet.assignment.map((assignment) => {
        return {
          ...assignment,
        };
      });
    });

    return assignmentSetResult;
  } catch (error: any) {
    console.log('error fetching assignments', error);
    throw new ApiError(error.message, 400);
  }
};

export const getAssignmentsByTeacher = async ({
  teacherId,
}: AssignmentGetData) => {
  try {
    const teacherClassrooms = await prisma.classroom.findMany({
      where: { createdBy: teacherId },
    });
    const assignments = [] as any[];
    await Promise.all(
      teacherClassrooms.map(async (classroom) => {
        const assignment = await prisma.assignmentSet.findMany({
          where: {
            classroomId: classroom.id,
          },
          select: {
            assignment: {
              select: {
                id: true,
                displayName: true,
                dueAt: true,
                educatorDescription: true,
                notebookDescription: true,
                grade: true,
                unit: true,
                createdBy: true,
                groupId: true,
                roomKey: true,
                active: true,
                assignmentSetId: true,
                updatedAt: true,
                createdAt: true,
                updatedBy: true,
                classroom: {
                  select: {
                    id: true,
                    displayName: true,
                  },
                },
              },
              where: { active: true },
              take: 1,
              orderBy: { createdAt: 'asc' },
            },
          },
        });
        const assignmentResult = assignment.flatMap((assignment) => {
          return assignment.assignment.map((assignment) => {
            return {
              ...assignment,
            };
          });
        });
        assignments.push(...assignmentResult);
      })
    );
    return assignments;
  } catch (error: any) {
    console.log('error fetching assignments', error);
    throw new ApiError(error.message, 400);
  }
};

export const getAssignmentsByStudent = async (studentId: string) => {
  try {
    const groupWithAssignments = await prisma.group.findMany({
      where: {
        students: {
          some: {
            id: studentId,
          },
        },
      },
      include: {
        assignments: {
          where: { active: true },
          select: {
            id: true,
            displayName: true,
            dueAt: true,
            educatorDescription: true,
            notebookDescription: true,
            grade: true,
            unit: true,
            createdBy: true,
            groupId: true,
            roomKey: true,
            assignmentSetId: true,
            updatedAt: true,
            createdAt: true,
            active: true,

            classroom: {
              select: {
                id: true,
                displayName: true,
              },
            },
          },
          orderBy: { dueAt: 'desc' },
        },
      },
    });

    return groupWithAssignments.map((group) => group.assignments).flat();
  } catch (error: any) {
    console.log('error fetching assignments', error);
    throw new ApiError(error.message, 400);
  }
};

export const getAssignmentPageData = async ({
  assignmentSetId,
}: {
  assignmentSetId: string;
}): Promise<AssignmentSetPageData> => {
  try {
    const _assignment = await prisma.assignmentSet.findUnique({
      where: { id: assignmentSetId },
      select: {
        id: true,
        classroom: {
          select: {
            displayName: true,
          },
        },
        assignment: {
          select: {
            unit: true,
            grade: true,
            dueAt: true,
            educatorDescription: true,
            roomKey: true,
            active: true,
            id: true,
            displayName: true,
            group: {
              select: {
                displayName: true,
                id: true,
                students: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return _assignment;
  } catch (error) {
    console.error('error fetching assignment', error);
    throw new ApiError((error as any).message, 400);
  }
};

export const getAssignmentLogData = async ({
  assignmentId,
  assignmentSetId,
  page = 0,
  filters,
}: {
  filters: {
    selectedStudents: string[];
    selectedTeams: string[];
    selectedActivityTypes: string[];
  } | null;
  assignmentSetId: string;
  assignmentId: string;
  page: number;
}): Promise<AssignmentSetLogData> => {
  try {
    // groups for filters

    const {
      selectedStudents = [],
      selectedTeams = [],
      selectedActivityTypes = [],
    } = filters || {};
    const pageSize = 10;
    const offset = page * pageSize || 0;
    const where: any = {
      assignmentSetId,
    };

    if (!selectedTeams || selectedTeams.length !== 0) {
      where.group = { id: { in: selectedTeams } };
    }

    const getActivitySelect = (
      activityType: string,
      selectedActivityTypes: string[],
      offset: number,
      pageSize: number
    ) => {
      if (
        !selectedActivityTypes ||
        selectedActivityTypes.includes(activityType)
      ) {
        const commonSelect = {
          id: true,
          createdAt: true,
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        };

        switch (activityType) {
          case 'engineeringNotebookSteps':
            return {
              select: {
                ...commonSelect,
                action: true,
                data: true,
                iteration: true,
                field: true,
                page: true,
              },
              where: {
                studentId:
                  selectedStudents && selectedStudents.length > 0
                    ? { in: selectedStudents }
                    : {},
              },
              skip: offset,
              take: pageSize + 1,
            };
          case 'feelingsTracker':
            return {
              select: {
                ...commonSelect,
                type: true,
              },
              where: {
                studentId:
                  selectedStudents && selectedStudents.length > 0
                    ? { in: selectedStudents }
                    : {},
              },
              skip: offset,
              take: pageSize + 1,
            };
          case 'kudos':
            return {
              select: {
                id: true,
                createdAt: true,
                isPositive: true,
                type: true,
                sender: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                  },
                },
                receiver: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                  },
                },
              },
              where: {
                fromId:
                  selectedStudents && selectedStudents.length > 0
                    ? { in: selectedStudents }
                    : {},
              },
              skip: offset,
              take: pageSize + 1,
            };
          default:
            return {};
        }
      }
      return null;
    };
    const select: any = {
      id: true,
      displayName: true,
      group: {
        select: {
          id: true,
          displayName: true,
          students: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
      engineeringNotebookSteps: getActivitySelect(
        'engineeringNotebookSteps',
        selectedActivityTypes,
        offset,
        pageSize
      ),
      feelingsTracker: getActivitySelect(
        'feelingsTracker',
        selectedActivityTypes,
        offset,
        pageSize
      ),
      kudos: getActivitySelect('kudos', selectedActivityTypes, offset, 20),
    };

    const assignmentLogs = await prisma.assignment.findMany({
      where,
      select,
    });
    const trimAndCheckHasNext = (logs: void[]) => {
      const hasNext = logs.length > pageSize;
      if (hasNext) {
        logs.pop();
      }
      return hasNext;
    };

    let hasNextPage = false;
    for (const log of assignmentLogs) {
      log.hasMoreEngineeringNotebookSteps = trimAndCheckHasNext(
        log.engineeringNotebookSteps
      );
      log.hasMoreFeelingsTracker = trimAndCheckHasNext(log.feelingsTracker);
      log.hasMoreKudos = trimAndCheckHasNext(log.kudos);

      if (
        log.hasMoreEngineeringNotebookSteps ||
        log.hasMoreFeelingsTracker ||
        log.hasMoreKudos
      ) {
        hasNextPage = true;
        break;
      }
    }

    return {
      logs: assignmentLogs,
      hasNextPage,
      nextPage: hasNextPage ? (parseInt(page as string) || 0) + 1 : undefined,
    };
  } catch (error) {
    console.error('error fetching assignment', error);
    throw new ApiError((error as any).message, 400);
  }
};
export const getAssignmentSets = async ({
  assignmentSetId,
}: {
  assignmentSetId: string;
}): Promise<AssignmentSet[]> => {
  try {
    const assignmentSets = await prisma.assignmentSet.findMany({
      where: { id: assignmentSetId },
      include: {
        assignment: {
          take: 1,
        },
      },
    });

    return assignmentSets;
  } catch (error) {
    console.error('error fetching assignment sets', error);
    throw new ApiError((error as any).message, 400);
  }
};
export const updateAssignment = async (
  id: string,
  assignmentUpdateData: AssignmentUpdateFormData
): Promise<Assignment> => {
  const {
    displayName,
    grade,
    dueAt,
    unit,
    educatorDescription,
    notebookDescription,
  } = assignmentUpdateData;

  // redundant, just that service can be standalone
  const _assignment = await prisma.assignment.findUnique({ where: { id } });
  if (!_assignment)
    throw new ApiError(`Assignment with id: ${id} not found.`, 404);

  const data = {
    ...(displayName && { displayName }),
    ...(grade && { grade }),
    ...(dueAt && { dueAt }),
    ...(unit && { unit }),
    ...(educatorDescription && { educatorDescription }),
    ...(notebookDescription && { notebookDescription }),
  };

  const assignment = await prisma.assignment.update({
    where: { id },
    data,
  });

  if (!assignment) throw new ApiError('Update assignment failed.', 400);

  return assignment;
};

export const deleteAssignment = async (id: string): Promise<Assignment> => {
  const _assignment = await prisma.assignment.findUnique({ where: { id } });
  if (!_assignment)
    throw new ApiError(`Assignment with id: ${id} not found.`, 404);

  const assignment = await prisma.assignment.delete({
    where: { id },
  });

  if (!assignment) throw new ApiError('Delete assignment failed.', 400);

  return assignment;
};

export const getAssignmentById = async (
  id: string
): Promise<Partial<Assignment> | null> => {
  const assignment = await prisma.assignment.findUnique({
    where: { id },
    select: {
      id: true,
    },
  });

  return assignment;
};
