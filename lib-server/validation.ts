import dayjs from 'dayjs';
import { QueryParamsType } from 'types';
import { z } from 'zod';
import ApiError from './error';

const trimString = (u: unknown) => (typeof u === 'string' ? u.trim() : u);

const passwordMin = 6,
  passwordMax = 40,
  nameMin = 2,
  nameMax = 20;

const errorMessages = {
  firstNameMinError: `First Name must be at least ${nameMin} characters long`,
  firstNameMaxError: `First Name must be at most ${nameMax} characters long`,
  lastNameMinError: `Last Name must be at least ${nameMin} characters long`,
  lastNameMaxError: `Last Name must be at most ${nameMax} characters long`,
  passwordMinError: `Password must be at least ${passwordMin} characters long`,
  passwordMaxError: `Password must be at most ${passwordMax} characters long`,
  emailError: 'Email must be a valid email address',
  passwordMatchError: 'Passwords must match',
};

export const userGetSchema = z
  .object({
    id: z.string().trim().cuid().optional().or(z.literal('')),
    email: z.string().trim().email().optional().or(z.literal('')),
  })
  .refine(
    (data) => data.id || data.email, // false triggers message
    'Either id, or email should be specified.'
  );

export const userLoginSchema = z.object({
  email: z.string().trim().email(),
  password: z
    .string()
    .trim()
    .min(passwordMin, { message: errorMessages.passwordMinError })
    .max(passwordMax, { message: errorMessages.passwordMaxError }),
});

export const userRegisterSchema = z
  .object({
    email: z.preprocess(trimString, z.string().trim().email()),
    password: z.preprocess(
      trimString,
      z
        .string()
        .trim()
        .min(passwordMin, { message: errorMessages.passwordMinError })
        .max(passwordMax, { message: errorMessages.passwordMaxError })
    ),
    confirmPassword: z.preprocess(
      trimString,
      z
        .string()
        .trim()
        .min(passwordMin, { message: errorMessages.passwordMinError })
        .max(passwordMax, { message: errorMessages.passwordMaxError })
    ),
    firstName: z
      .string()
      .trim()
      .min(nameMin, {
        message: errorMessages.firstNameMinError,
      })

      .max(nameMax, {
        message: errorMessages.firstNameMaxError,
      }),
    lastName: z
      .string()
      .trim()
      .min(nameMin, {
        message: errorMessages.lastNameMinError,
      })
      .max(nameMax, {
        message: errorMessages.lastNameMaxError,
      }),
    gender: z.string().optional(),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: errorMessages.passwordMatchError,
    path: ['confirmPassword'],
  });

export const userUpdateSchema = z.object({
  password: z.preprocess(
    trimString,
    z
      .string()
      .trim()
      .min(passwordMin, { message: errorMessages.passwordMinError })
      .max(passwordMax, { message: errorMessages.passwordMaxError })
      .optional()
      .or(z.literal(''))
  ),
  // +
  confirmPassword: z.preprocess(
    trimString,
    z
      .string()
      .trim()
      .min(passwordMin, { message: errorMessages.passwordMinError })
      .max(passwordMax, { message: errorMessages.passwordMaxError })
      .optional()
      .or(z.literal(''))
  ),

  firstName: z
    .string()
    .trim()
    .min(nameMin, {
      message: errorMessages.firstNameMinError,
    })
    .max(nameMax, {
      message: errorMessages.firstNameMaxError,
    })
    .optional(),

  lastName: z
    .string()
    .trim()
    .min(nameMin, {
      message: errorMessages.lastNameMinError,
    })
    .max(nameMax, {
      message: errorMessages.lastNameMaxError,
    })
    .optional(),
  image: z.string().optional(),
});

export const verifyUserSchema = z.object({
  userId: z.string().trim().cuid({ message: 'Invalid user id' }),
  token: z.string().trim().uuid({ message: 'Invalid token' }),
});

export const userForgotPasswordSchema = z.object({
  email: z.preprocess(trimString, z.string().trim().email()),
});

export const userResetPasswordSchema = z
  .object({
    password: z.preprocess(
      trimString,
      z
        .string()
        .trim()
        .min(passwordMin, { message: errorMessages.passwordMinError })
        .max(passwordMax, { message: errorMessages.passwordMaxError })
    ),
    confirmPassword: z.preprocess(
      trimString,
      z
        .string()
        .trim()
        .min(passwordMin, { message: errorMessages.passwordMinError })
        .max(passwordMax, { message: errorMessages.passwordMaxError })
    ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: errorMessages.passwordMatchError,
    path: ['confirmPassword'],
  });

export const studentCreateSchema = z
  .object({
    email: z.preprocess(trimString, z.string().trim().email()),
    password: z.preprocess(
      trimString,
      z
        .string()
        .trim()
        .min(passwordMin, { message: errorMessages.passwordMinError })
        .max(passwordMax, { message: errorMessages.passwordMaxError })
    ),
    confirmPassword: z.preprocess(
      trimString,
      z
        .string()
        .trim()
        .min(passwordMin, { message: errorMessages.passwordMinError })
        .max(passwordMax, { message: errorMessages.passwordMaxError })
    ),
    firstName: z
      .string()
      .trim()
      .min(nameMin, {
        message: errorMessages.firstNameMinError,
      })

      .max(nameMax, {
        message: errorMessages.firstNameMaxError,
      }),
    lastName: z
      .string()
      .trim()
      .min(nameMin, {
        message: errorMessages.lastNameMinError,
      })
      .max(nameMax, {
        message: errorMessages.lastNameMaxError,
      }),
    gender: z.string().optional(),
    teacherId: z.string().trim().cuid({ message: 'Invalid teacher id' }),
    classroomId: z.string().trim().cuid({ message: 'Invalid classroom id' }),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: errorMessages.passwordMatchError,
    path: ['confirmPassword'],
  });

export const studentCreateViaCsvFileSchema = z.object({
  teacherId: z.string().trim().cuid({ message: 'Invalid teacher id' }),
  classroomId: z.string().trim().cuid({ message: 'Invalid classroom id' }),
  students: z.array(
    z.object({
      email: z.preprocess(trimString, z.string().trim().email()),
      first_name: z
        .string()
        .trim()
        .min(nameMin, {
          message: errorMessages.firstNameMinError,
        })
        .max(nameMax, {
          message: errorMessages.firstNameMaxError,
        }),
      last_name: z
        .string()
        .trim()
        .min(nameMin, {
          message: errorMessages.lastNameMinError,
        })
        .max(nameMax, {
          message: errorMessages.lastNameMaxError,
        }),
      password: z.preprocess(
        trimString,
        z
          .string()
          .trim()
          .min(passwordMin, { message: errorMessages.passwordMinError })
          .max(passwordMax, { message: errorMessages.passwordMaxError })
      ),
      gender: z.string().optional(),
    })
  ),
});

// ----------- manual validation with safeParse() -------------

export const userIdCuidSchema = z.object({
  id: z.string().cuid(),
});

export const validateUserIdCuid = (id: string): string => {
  const result = userIdCuidSchema.safeParse({ id });
  if (!result.success) throw ApiError.fromZodError(result.error);

  return result.data.id;
};

export const validateVerifyUserParams = (
  params: QueryParamsType
): { userId: string; token: string } => {
  const result = verifyUserSchema.safeParse(params);
  if (!result.success) throw ApiError.fromZodError(result.error);
  return result.data;
};

// --------------- classrooms ---------------

const classroomNameMin = 3,
  classroomNameMax = 30,
  classroomDescriptionMin = 3,
  classroomDescriptionMax = 250,
  classroomGrade = [
    'K',
    'FIRST',
    'SECOND',
    'THIRD',
    'FOURTH',
    'FIFTH',
    'SIXTH',
    'SEVENTH',
    'EIGHTH',
  ] as const,
  classroomDate = z.date().or(z.literal('')).or(z.string()),
  classroomNicknameMin = 3,
  classroomNicknameMax = 30;

const classroomErrorMessages = {
  nameMinError: `Classroom name must be at least ${classroomNameMin} characters long`,
  nameMaxError: `Classroom name must be at most ${classroomNameMax} characters long`,
  descriptionMinError: `Classroom description must be at least ${classroomDescriptionMin} characters long`,
  descriptionMaxError: `Classroom description must be at most ${classroomDescriptionMax} characters long`,
  gradeError: `Classroom grade must be one of ${classroomGrade.join(', ')}`,
  startDateError: `start date must be a valid date`,
  endDateError: `end date must be a valid date`,
  nicknameMinError: `Nickname must be at least ${classroomNicknameMin} characters long`,
  nicknameMaxError: `Nickname must be at most ${classroomNicknameMax} characters long`,
};

/** 
* @swagger
components:
  schemas:
    ClassroomCreate:
      type: object
      properties:
        displayName:
          type: string
          minLength: ${classroomNameMin}
          maxLength: ${classroomNameMax}
        description:
          type: string
          minLength: ${classroomDescriptionMin}
          maxLength: ${classroomDescriptionMax}
        grade:
          type: string
          enum:
            - ${classroomGrade}
        startDate:
          type: string
          format: date
        endDate:
          type: string
          format: date
        nickname:
          type: string
          minLength: ${classroomNameMin}
          maxLength: ${classroomNameMax}
          nullable: true
      required:
        - displayName
        - description
        - grade
        - startDate
        - endDate
      example:
        displayName: "Classroom 1"
        description: "This is a sample description for classroom 1"
        grade: "Grade 1"
        startDate: "2023-02-08"
        endDate: "2023-03-08"
        nickname: "Class 1"
        */
export const classroomCreateSchema = z
  .object({
    displayName: z
      .string()
      .min(classroomNameMin, { message: classroomErrorMessages.nameMinError })
      .max(classroomNameMax, { message: classroomErrorMessages.nameMaxError }),
    description: z
      .string()
      .min(classroomDescriptionMin, {
        message: classroomErrorMessages.descriptionMinError,
      })
      .max(classroomDescriptionMax, {
        message: classroomErrorMessages.descriptionMaxError,
      }),
    grade: z.enum(classroomGrade),
    startDate: classroomDate,
    endDate: classroomDate,
    nickname: z
      .string()
      .min(classroomNameMin, {
        message: classroomErrorMessages.nicknameMinError,
      })
      .max(classroomNameMax, {
        message: classroomErrorMessages.nicknameMaxError,
      })
      .optional(),
  })
  .refine((data) => data.startDate < data.endDate, {
    message: 'Start date must be before end date',
    path: ['startDate'],
  });

export const classroomUpdateSchema = z.object({
  displayName: z
    .string()
    .min(classroomNameMin, { message: classroomErrorMessages.nameMinError })
    .max(classroomNameMax, { message: classroomErrorMessages.nameMaxError })
    .optional(),
  nickname: z.string().optional(),
  description: z
    .string()
    .min(classroomDescriptionMin)
    .max(classroomDescriptionMax)
    .optional(),
  grade: z.enum(classroomGrade).optional(),
  endDate: classroomDate.optional(),
});

export const classroomDeleteSchema = z.object({
  id: z.string().cuid(),
});

export const classroomGetSchema = z.object({
  id: z.string().cuid(),
});

export const classroomGetAllSchema = z.object({
  userId: z.string().cuid(),
});

export const classroomIdSchema = z.object({
  classroomId: z.string().cuid(), // req.query is string
});

// ----------- manual validation with safeParse() -------------

export const validateClassroomId = (classroomId: string): string => {
  const result = classroomIdSchema.safeParse({ classroomId });
  if (!result.success) throw ApiError.fromZodError(result.error);

  return result.data.classroomId;
};

// --------------- tasks ---------------

const taskNameMin = 2,
  taskNameMax = 30,
  taskUnit = ['energy-and-circuits', 'forces-and-motion'] as const,
  taskGrade = [
    'K',
    'FIRST',
    'SECOND',
    'THIRD',
    'FOURTH',
    'FIFTH',
    'SIXTH',
    'SEVENTH',
    'EIGHTH',
    'MULTIPLE',
  ] as const,
  taskNotebookDescriptionMin = 3,
  taskNotebookDescriptionMax = 250,
  taskNotebookSummaryMin = 3,
  taskNotebookSummaryMax = 1000;

const taskErrorMessages = {
  nameMinError: `Task name must be at least ${taskNameMin} characters long`,
  nameMaxError: `Task name must be at most ${taskNameMax} characters long`,
  notebookDescriptionMinError: `Notebook description must be at least ${taskNotebookDescriptionMin} characters long`,
  notebookDescriptionMaxError: `Notebook description must be at most ${taskNotebookDescriptionMax} characters long`,
  notebookSummaryMinError: `Notebook summary must be at least ${taskNotebookSummaryMin} characters long`,
  notebookSummaryMaxError: `Notebook summary must be at most ${taskNotebookSummaryMax} characters long`,
};

export const taskCreateSchema = z.object({
  displayName: z
    .string()
    .min(taskNameMin, {
      message: taskErrorMessages.nameMinError,
    })
    .max(taskNameMax, {
      message: taskErrorMessages.nameMaxError,
    }),
  notebookDescription: z
    .string()
    .min(taskNotebookDescriptionMin, {
      message: taskErrorMessages.notebookDescriptionMinError,
    })
    .max(taskNotebookDescriptionMax, {
      message: taskErrorMessages.notebookDescriptionMaxError,
    }),
  notebookSummary: z
    .string()
    .trim()
    .min(taskNotebookSummaryMin, {
      message: taskErrorMessages.notebookSummaryMinError,
    })
    .max(taskNotebookSummaryMax, {
      message: taskErrorMessages.notebookSummaryMaxError,
    }),
  unit: z.enum(taskUnit),
  grade: z.enum(taskGrade),
});

export const taskUpdateSchema = z.object({
  displayName: z
    .string()
    .min(taskNameMin, {
      message: taskErrorMessages.nameMinError,
    })
    .max(taskNameMax, {
      message: taskErrorMessages.nameMaxError,
    })
    .optional(),
  notebookDescription: z
    .string()
    .min(taskNotebookDescriptionMin, {
      message: taskErrorMessages.notebookDescriptionMinError,
    })
    .max(taskNotebookDescriptionMax, {
      message: taskErrorMessages.notebookDescriptionMaxError,
    })
    .optional(),
});

export const taskGetSchema = z.object({
  id: z.string().cuid(),
});

// --------------- groupSets ---------------

export const groupSetIdSchema = z.object({
  groupsetId: z.string().cuid(), // req.query is string
});

export const groupIdSchema = z.object({
  groupId: z.string().cuid(), // req.query is string
});

const groupSetDisplayNameMin = 3,
  groupSetDisplayNameMax = 25;

const groupSetErrorMessages = {
  displayNameMinError: `Group Set name must be at least ${groupSetDisplayNameMin} characters long`,
  displayNameMaxError: `Group Set name must be at most ${groupSetDisplayNameMax} characters long`,
};

export const groupSetCreateSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(groupSetDisplayNameMin, {
      message: groupSetErrorMessages.displayNameMinError,
    })
    .max(groupSetDisplayNameMax, {
      message: groupSetErrorMessages.displayNameMaxError,
    }),
});

// --------------- Assignment Creation ---------------

const assignmentCreateDisplayNameMin = 3,
  assignmentCreateDisplayNameMax = 25;

const assignmentCreateErrorMessages = {
  displayNameMinError: `Assignment name must be at least ${assignmentCreateDisplayNameMin} characters long`,
  displayNameMaxError: `Assignment name must be at most ${assignmentCreateDisplayNameMax} characters long`,
};

export const assignmentCreateSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(assignmentCreateDisplayNameMin, {
      message: assignmentCreateErrorMessages.displayNameMinError,
    })
    .max(assignmentCreateDisplayNameMax, {
      message: assignmentCreateErrorMessages.displayNameMaxError,
    }),
  taskId: z.object({ value: z.string().cuid() }),
  groupSetId: z
    .object({ value: z.string().cuid() })
    .nullable()
    .refine((groupSet) => groupSet !== null && groupSet.value !== '', {
      message: 'Group Set is required',
    }),
  dueAt: z
    .date()
    .or(z.string())
    .refine(
      (value) => {
        // date needs to be in the future
        return dayjs(value).isAfter(dayjs());
      },
      {
        message: 'Due date must be at least 2 days in the future',
      }
    ),
});

export const assignmentQueryParamsSchema = z.object({
  classroomId: z.string().cuid().trim().optional(),
});

export const assignmentIdQueryParamsSchema = z.object({
  assignmentId: z.string().cuid(),
});
export const assignmentIdWithClassroomIdQueryParamsSchema = z.object({
  assignmentId: z.string().cuid(),
  assignmentSetId: z.string().cuid(),
  page: z.string().optional(),
  filters: z.string().optional(),
});
