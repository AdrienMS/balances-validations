import { Movement } from 'src/movement/models';

export const multipleMovements: Movement[] = [
  {
    id: 1,
    date: new Date('2024-04-01T00:00:00.000Z'),
    wording: 'A',
    amount: 100,
  },
  {
    id: 2,
    date: new Date('2024-04-02T00:00:00.000Z'),
    wording: 'B',
    amount: 50,
  },
  {
    id: 3,
    date: new Date('2024-04-03T00:00:00.000Z'),
    wording: 'C',
    amount: 20,
  },
  {
    id: 2,
    date: new Date('2024-04-02T00:00:00.000Z'),
    wording: 'B',
    amount: 50,
  },
];

export const duplicateMovements: Movement[] = [
  {
    id: 1,
    date: new Date('2024-04-01T00:00:00.000Z'),
    wording: 'A',
    amount: 100,
  },
  {
    id: 2,
    date: new Date('2024-04-02T00:00:00.000Z'),
    wording: 'B',
    amount: 50,
  },
  {
    id: 3,
    date: new Date('2024-04-03T00:00:00.000Z'),
    wording: 'C',
    amount: 20,
  },
  {
    id: 2,
    date: new Date('2024-04-04T00:00:00.000Z'),
    wording: 'B',
    amount: 200,
  },
];

export const rangeMovements: Movement[] = [
  {
    id: 1,
    date: new Date('2025-04-01T00:00:00.000Z'),
    wording: 'A',
    amount: 100,
  },
  {
    id: 2,
    date: new Date('2023-04-02T00:00:00.000Z'),
    wording: 'B',
    amount: 50,
  },
  {
    id: 3,
    date: new Date('2024-04-03T00:00:00.000Z'),
    wording: 'C',
    amount: 100,
  },
];

export const calculMovements: Movement[] = [
  {
    id: 1,
    date: new Date('2024-04-01T00:00:00.000Z'),
    wording: 'A',
    amount: 100,
  },
  {
    id: 2,
    date: new Date('2024-04-02T00:00:00.000Z'),
    wording: 'B',
    amount: 50,
  },
  {
    id: 3,
    date: new Date('2024-04-03T00:00:00.000Z'),
    wording: 'C',
    amount: 20,
  },
  {
    id: 4,
    date: new Date('2024-05-03T00:00:00.000Z'),
    wording: 'D',
    amount: 100,
  },
  {
    id: 5,
    date: new Date('2024-05-04T00:00:00.000Z'),
    wording: 'E',
    amount: 20,
  },
];

export const validMovements: Movement[] = [
  {
    id: 1,
    date: new Date('2024-04-02T00:00:00.000Z'),
    wording: 'A',
    amount: 50,
  },
  {
    id: 2,
    date: new Date('2024-04-02T00:00:00.000Z'),
    wording: 'B',
    amount: 30,
  },
  {
    id: 3,
    date: new Date('2024-04-03T00:00:00.000Z'),
    wording: 'C',
    amount: 20,
  },
  {
    id: 4,
    date: new Date('2024-05-03T00:00:00.000Z'),
    wording: 'D',
    amount: 80,
  },
  {
    id: 5,
    date: new Date('2024-05-04T00:00:00.000Z'),
    wording: 'E',
    amount: 20,
  },
];
