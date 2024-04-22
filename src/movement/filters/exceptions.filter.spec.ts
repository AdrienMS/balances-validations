import {
  ArgumentsHost,
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MovementExceptionsFilter } from './exceptions.filter';
import {
  badRequestError,
  badRequestMessages,
  calculError,
  unknowError,
} from '../mocks/error.mock';

describe('MovementExceptionsFilter', () => {
  let filter: MovementExceptionsFilter;
  let host: ArgumentsHost;

  beforeEach(() => {
    filter = new MovementExceptionsFilter();
    host = {
      switchToHttp: () => ({
        getResponse: () => ({
          status: () => ({
            json: (response: any) => response,
          }),
        }),
      }),
    } as ArgumentsHost;
  });

  it('should catch conflict exception', () => {
    expect(filter.catch(new ConflictException(calculError), host)).toEqual({
      message: `I'm a teapot`,
      reasons: calculError,
    });
  });

  it('should catch bad request exception', () => {
    expect(
      filter.catch(new BadRequestException(badRequestMessages), host),
    ).toEqual(badRequestError);
  });

  it('should catch unknow exception', () => {
    expect(
      filter.catch(
        new HttpException('unknown', HttpStatus.INTERNAL_SERVER_ERROR),
        host,
      ),
    ).toEqual(unknowError);
  });
});
