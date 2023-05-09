// NOTE: this file must be in javascript, so seed can work in production
// without dev dependencies
// process.env.DATABASE_URL must be defined, not from client, but in schema

// process.env.DEBUG = '*';

const { PrismaClient } = require('@prisma/client');
const { hashSync } = require('bcryptjs');
const { faker } = require('@faker-js/faker');
const { loadEnvConfig } = require('@next/env');

// join(__dirname, '..') gives wrong path in prod
const rootDirAbsolutePath = process.cwd();

// load process.env.DATABASE_URL from .env.local
loadEnvConfig(rootDirAbsolutePath);

// MUST repeat definitions, imports don't work
// separate build context from next app

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

const password = hashSync('123456', 10);

const getRandomGrade = () => {
  const grades = [
    'K',
    'FIRST',
    'SECOND',
    'THIRD',
    'FOURTH',
    'FIFTH',
    'SIXTH',
    'SEVENTH',
    'EIGHTH',
  ];
  return grades[Math.floor(Math.random() * grades.length)];
};

const createEntities = (n, generator) => {
  return Array.from(Array(n).keys()).map(generator);
};

const generateClassroom = () => ({
  displayName: `Classroom Display Name`,
  nickname: `Clasroom Nickname` + faker.random.numeric(1),
  description: faker.lorem.sentences(1),
  startDate: faker.date.soon(1),
  endDate: faker.date.future(1, new Date()),
  grade: getRandomGrade(),
  accessCode: faker.random.alpha({
    count: 6,
    casing: 'upper',
  }),
});

const generateStudent = () => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const email = faker.internet.email(firstName, lastName).toLowerCase();
  return {
    firstName: firstName,
    lastName: lastName,
    email: email,
    password,
    role: 'STUDENT',
    gender: faker.name.sex(),
    emailVerified: new Date(),
    active: true,
    verificationToken: null,
  };
};

const generateTask = (teacherId) => ({
  displayName: faker.commerce.product(),
  unit: ['forces-and-motion', 'energy-and-circuits'][getRandomInt(2)],
  grade: getRandomGrade(),
  notebookDescription: faker.lorem.sentences(),
  notebookSummary: faker.lorem.sentences(),
  createdBy: teacherId,
  type: 'CREATE_SPACE',
});

const generateEngineeringNotebookSteps = (studentId) => ({
  data: faker.lorem.sentences(3),
  action: faker.helpers.arrayElement(['update', 'create', 'delete', 'modify']),
  iteration: faker.datatype.number(10),
  studentId: studentId,
  field: faker.helpers.arrayElement([
    'objectives',
    'constraints',
    'connection',
    'discovered',
    'question',
    'idea',
    'feeling',
    'confused',
    'observe',
    'explain',
    'modify',
  ]),
  page: faker.helpers.arrayElement(['goal', 'results', 'reflect']),
});

const generateFeelingsTracker = (studentId) => ({
  studentId: studentId,
  type: faker.helpers.arrayElement([
    'HAPPY',
    'CALM',
    'FOCUSED',
    'READYTOLEARN',
    'SAD',
    'SICK',
    'FURIOUS',
    'TIRED',
    'FRUSTRATED',
    'WORRIED',
    'SILLY',
    'EXCITED',
    'MAD',
    'TERRIFIED',
    'YELLING',
    'WITHDRAWN',
  ]),
});
const generateKudos = (studentId, receiverId) => ({
  type: faker.helpers.arrayElement(['TEAMWORK', 'EFFORT', 'COMMUNICATION']),
  isPositive: faker.datatype.boolean(),
  fromId: studentId,
  toId: receiverId,
});

async function upsertEntity(model, where, createData) {
  return await model.upsert({
    where,
    create: createData,
    update: {},
  });
}

/**
 * class so all functions use same PrismaClient
 * use this as constructor: SeedSingleton.getInstance(prisma)
 */
class SeedSingleton {
  constructor(prisma, isInternalClient) {
    this.isInternalClient = isInternalClient;
    this.prisma = prisma;

    SeedSingleton.instance = this;
  }

  static getInstance(prisma = null) {
    if (!SeedSingleton.instance) {
      const isInternalClient = !prisma;
      const prismaClient = isInternalClient ? new PrismaClient() : prisma;
      console.log('Creating new SeedSingleton instance ...');

      SeedSingleton.instance = new SeedSingleton(
        prismaClient,
        isInternalClient
      );
    }
    return SeedSingleton.instance;
  }

  async handledDeleteAllTables() {
    try {
      await this.deleteAllTables();
    } catch (error) {
      console.error('Handled delete tables error:', error);
    }
  }

  async handledSeed() {
    try {
      await this.seed();
    } catch (error) {
      console.error('Handled seed error:', error);
    }
  }

  async deleteAllTables() {
    console.log('Deleting tables ...');
    await this.prisma.$transaction([
      this.prisma.gridStep.deleteMany(),
      this.prisma.engineeringNotebookStep.deleteMany(),
      this.prisma.tasks.deleteMany(),
      this.prisma.assignmentSet.deleteMany(),
      this.prisma.assignment.deleteMany(),
      this.prisma.portfolio.deleteMany(),
      this.prisma.group.deleteMany(),
      this.prisma.groupSet.deleteMany(),
      this.prisma.classroom.deleteMany(),
      this.prisma.account.deleteMany(),
      this.prisma.session.deleteMany(),
      this.prisma.user.deleteMany(),
    ]);
    console.log('Tables deleted.');
  }

  async upsertTeamUsers(prisma, userData) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });
    if (existingUser) {
      return {
        teacher: existingUser,
        created: false,
      };
    }

    return {
      teacher: await prisma.user.upsert({
        where: {
          email: userData.email,
        },
        create: {
          ...userData,
          password,
          active: true,
          emailVerified: new Date(),
          verificationToken: null,
          role: 'TEACHER',
        },
        update: {},
      }),
      created: true,
    };
  }

  starterUsers = [
    {
      firstName: 'Full Test',
      lastName: 'Teacher',
      email: 'full@something.com',
    },
  ];

  // just require file, or fn will be called 2 times
  // without exception handling here
  async seed() {
    console.log('Started seeding ...');

    for (const user of this.starterUsers) {
      const { teacher, created } = await this.upsertTeamUsers(
        this.prisma,
        user
      );
      console.log('Created teacher:', teacher.email, created);
      if (created) {
        const tasks = createEntities(1, () => generateTask(teacher.id));

        for (const task of tasks) {
          await this.prisma.tasks.create({
            data: task,
          });
        }

        for (const classroomData of createEntities(1, generateClassroom)) {
          const newClassroom = await this.prisma.classroom.create({
            data: {
              ...classroomData,
              teacherId: teacher.id,
              createdBy: teacher.id,
            },
          });
          const students = [];
          for (const studentData of createEntities(8, generateStudent)) {
            const newStudent = await upsertEntity(
              this.prisma.user,
              { email: studentData.email },
              studentData
            );
            students.push(newStudent);

            await this.prisma.classroomMembership.create({
              data: {
                classroomId: newClassroom.id,
                userId: newStudent.id,
                joinedAt: new Date(),
              },
            });
          }
          // Split students into two groups
          const group1Students = students.slice(0, 4);
          const group2Students = students.slice(4, 8);
          const _groupSet = await this.prisma.groupSet.create({
            data: {
              displayName: 'Group Set 1',
              classroomId: newClassroom.id,
              createdBy: teacher.id,
              groups: {
                create: [
                  {
                    displayName: 'Group 1',
                    createdBy: teacher.id,
                    students: {
                      connect: group1Students.map((s) => ({ id: s.id })),
                    },
                  },
                  {
                    displayName: 'Group 2',
                    createdBy: teacher.id,
                    students: {
                      connect: group2Students.map((s) => ({ id: s.id })),
                    },
                  },
                ],
              },
            },
          });
          const groupSet = await this.prisma.groupSet.findUnique({
            where: { id: _groupSet.id },
            include: {
              groups: true,
            },
          });

          const assignmentSets = await this.prisma.assignmentSet.create({
            data: {
              classroomId: newClassroom.id,
              assignment: {
                create: [
                  {
                    displayName: 'assignment 1',
                    createdBy: teacher.id,
                    roomKey: faker.random.alpha({
                      count: 6,
                      casing: 'upper',
                    }),
                    grade: tasks[0].grade,
                    unit: tasks[0].unit,
                    notebookDescription: tasks[0].notebookDescription,
                    educatorDescription: faker.lorem.sentences(),
                    dueAt: faker.date.future(1, new Date()),
                    classroomId: newClassroom.id,
                    groupId: groupSet.groups[0].id,
                  },
                  {
                    displayName: 'assignment 2',
                    createdBy: teacher.id,
                    roomKey: faker.random.alpha({
                      count: 6,
                      casing: 'upper',
                    }),
                    grade: tasks[0].grade,
                    unit: tasks[0].unit,
                    notebookDescription: tasks[0].notebookDescription,
                    educatorDescription: faker.lorem.sentences(),
                    dueAt: faker.date.future(1, new Date()),
                    classroomId: newClassroom.id,
                    groupId: groupSet.groups[1].id,
                  },
                ],
              },
            },
          });

          const assignments = await this.prisma.assignment.findMany({
            where: {
              assignmentSetId: assignmentSets.id,
            },
          });

          group1Students.forEach(async (student) => {
            for (const notebookStep of createEntities(15, () =>
              generateEngineeringNotebookSteps(student.id)
            )) {
              await this.prisma.engineeringNotebookStep.create({
                data: {
                  ...notebookStep,
                  assignmentId: assignments[0].id,
                },
              });
            }
            for (const kudo of createEntities(15, () =>
              generateKudos(student.id, group1Students[3].id)
            )) {
              await this.prisma.kudo.create({
                data: {
                  type: kudo.type,
                  isPositive: kudo.isPositive,

                  assignment: {
                    connect: {
                      id: assignments[0].id,
                    },
                  },
                  sender: {
                    connect: {
                      id: kudo.fromId,
                    },
                  },
                  receiver: {
                    connect: {
                      id: kudo.toId,
                    },
                  },
                },
              });
            }
            for (const feelingTracker of createEntities(15, () =>
              generateFeelingsTracker(student.id)
            )) {
              await this.prisma.feelingsTracker.create({
                data: {
                  ...feelingTracker,
                  assignmentId: assignments[0].id,
                },
              });
            }
          });
          group2Students.forEach(async (student) => {
            for (const notebookStep of createEntities(15, () =>
              generateEngineeringNotebookSteps(student.id)
            )) {
              await this.prisma.engineeringNotebookStep.create({
                data: {
                  ...notebookStep,
                  assignmentId: assignments[1].id,
                },
              });
            }
            for (const kudo of createEntities(15, () =>
              generateKudos(student.id, group2Students[3].id)
            )) {
              await this.prisma.kudo.create({
                data: {
                  type: kudo.type,
                  isPositive: kudo.isPositive,
                  assignment: {
                    connect: {
                      id: assignments[1].id,
                    },
                  },
                  sender: {
                    connect: {
                      id: kudo.fromId,
                    },
                  },
                  receiver: {
                    connect: {
                      id: kudo.toId,
                    },
                  },
                },
              });
            }
            for (const feelingTracker of createEntities(15, () =>
              generateFeelingsTracker(student.id)
            )) {
              await this.prisma.feelingsTracker.create({
                data: {
                  ...feelingTracker,
                  assignmentId: assignments[1].id,
                },
              });
            }
          });
        }
      }
    }
    console.log('  users created.');
  }

  async run() {
    try {
      await this.deleteAllTables();
      await this.seed();
    } catch (error) {
      console.error('Seeding error:', error);
      if (this.isInternalClient) {
        process.exit(1);
      }
    } finally {
      if (this.isInternalClient) {
        await this.prisma.$disconnect();
      }
    }
  }
}

module.exports = {
  SeedSingleton,
};
