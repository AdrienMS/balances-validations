import { Test, TestingModule } from '@nestjs/testing';
import { MovementService } from './movement.service';
import {
  calculBalances,
  calculMovements,
  duplicateMovements,
  multipleBalances,
  multipleMovements,
  rangeBalances,
  rangeMovements,
  validMovements,
} from '../mocks';

describe('MovementService', () => {
  let service: MovementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MovementService],
    }).compile();

    service = module.get<MovementService>(MovementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return duplicate error', () => {
    const movements = duplicateMovements;
    const balances = multipleBalances;
    expect(service.validation(movements, balances)).toStrictEqual([
      {
        duplicate: [
          {
            amount: 200,
            date: new Date('2024-04-04T00:00:00.000Z'),
            id: 2,
            wording: 'B',
          },
          {
            amount: 50,
            date: new Date('2024-04-02T00:00:00.000Z'),
            id: 2,
            wording: 'B',
          },
        ],
        reason: 'Two movements contain the same identifier',
      },
    ]);
  });

  it('should return multiple error', () => {
    const movements = multipleMovements;
    const balances = multipleBalances;
    expect(service.validation(movements, balances)).toStrictEqual([
      {
        duplicate: [
          {
            amount: 50,
            date: new Date('2024-04-02T00:00:00.000Z'),
            id: 2,
            wording: 'B',
          },
          {
            amount: 50,
            date: new Date('2024-04-02T00:00:00.000Z'),
            id: 2,
            wording: 'B',
          },
        ],
        reason: 'Two movements are identical',
      },
    ]);
  });

  it('should return range error', () => {
    const movements = rangeMovements;
    const balances = rangeBalances;
    expect(service.validation(movements, balances)).toStrictEqual([
      {
        outRange: {
          amount: 100,
          date: new Date('2025-04-01T00:00:00.000Z'),
          id: 1,
          wording: 'A',
        },
        reason: 'Movements out of range',
      },
      {
        outRange: {
          amount: 50,
          date: new Date('2023-04-02T00:00:00.000Z'),
          id: 2,
          wording: 'B',
        },
        reason: 'Movements out of range',
      },
    ]);
  });

  it('should return calcul error', () => {
    const movements = calculMovements;
    const balances = calculBalances;
    expect(service.validation(movements, balances)).toStrictEqual([
      {
        detail: 'Got 70 instead of 100 for checkpoint dated May 1, 2024',
        reason: 'Missing movements',
      },
      {
        detail: 'Got 120 instead of 100 for checkpoint dated June 1, 2024',
        reason: 'Excess movements',
      },
    ]);
  });

  it('should not return error', () => {
    const movements = validMovements;
    const balances = calculBalances;
    expect(service.validation(movements, balances)).toStrictEqual([]);
  });
});
