import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { calculBalances, calculMovements, validMovements } from '../mocks';
import { MovementService } from '../services';

import { MovementController } from './movement.controller';

describe('MovementController', () => {
  let controller: MovementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovementController],
      providers: [MovementService],
    }).compile();

    controller = module.get<MovementController>(MovementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a bad request error', () => {
    try {
      controller.validation({
        movements: null,
        balances: null,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(TypeError);
    }
  });

  it('should return a conflict error', () => {
    try {
      controller.validation({
        movements: calculMovements,
        balances: calculBalances,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ConflictException);
    }
  });

  it('should return accepted', () => {
    expect(
      controller.validation({
        movements: validMovements,
        balances: calculBalances,
      }),
    ).toStrictEqual({ message: 'Accepted' });
  });
});
