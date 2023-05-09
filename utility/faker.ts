import { faker } from '@faker-js/faker';
import { AssignmentSetLogData } from 'types/models/Assignment';

export const generateFakeLogData = (entries: number): AssignmentSetLogData => {
  const logData: AssignmentSetLogData = [];

  for (let i = 0; i < entries; i++) {
    logData.push({
      id: faker.datatype.uuid(),
      displayName: faker.random.word(),
      group: {
        id: faker.datatype.uuid(),
        displayName: faker.random.word(),
        students: Array.from({ length: 4 }, () => ({
          id: faker.datatype.uuid(),
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
        })),
      },
      engineeringNotebookSteps: Array.from({ length: 6 }, () => ({
        id: faker.datatype.uuid(),
        createdAt: faker.date.past(),
        data: faker.random.word(),
        action: faker.random.word(),
        iteration: faker.datatype.number(),
        field: faker.random.word(),
        page: faker.random.word(),
        student: {
          id: faker.datatype.uuid(),
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
        },
      })),
      feelingsTracker: Array.from({ length: 6 }, () => ({
        id: faker.datatype.uuid(),
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
        createdAt: faker.date.past(),
        student: {
          id: faker.datatype.uuid(),
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
        },
      })),
      kudos: Array.from({ length: 6 }, () => ({
        id: faker.datatype.uuid(),
        createdAt: faker.date.past(),
        type: faker.helpers.arrayElement([
          'TEAMWORK',
          'EFFORT',
          'COMMUNICATION',
        ]),
        isPositive: faker.datatype.boolean(),
        sender: {
          id: faker.datatype.uuid(),
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
        },
        receiver: {
          id: faker.datatype.uuid(),
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
        },
      })),
    });
  }

  return logData;
};
