import {
  ArgumentsHost,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { MovementExceptionsFilter } from './exceptions.filter';
import {
  badRequestError,
  badRequestMessages,
  calculError,
} from '../mocks/error.mock';

describe('MovementExceptionsFilter', () => {
  let filter: MovementExceptionsFilter;

  beforeEach(() => {
    filter = new MovementExceptionsFilter();
  });

  it('should catch conflict exception', () => {
    const host = {
      switchToHttp: () => ({
        getResponse: () => ({
          status: () => ({
            json: (response: any) => response,
          }),
        }),
      }),
    } as ArgumentsHost;

    expect(filter.catch(new ConflictException(calculError), host)).toEqual({
      message: `I'm a teapot`,
      reasons: calculError,
    });
  });

  it('should catch bad request exception', () => {
    const host = {
      switchToHttp: () => ({
        getResponse: () => ({
          status: () => ({
            json: (response: any) => response,
          }),
        }),
      }),
    } as ArgumentsHost;

    expect(
      filter.catch(new BadRequestException(badRequestMessages), host),
    ).toEqual(badRequestError);
  });
});
