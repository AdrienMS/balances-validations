import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ConflictException,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { Response } from 'express';
import { Reason } from '../models';
import { EReason } from '../enums';

interface IExceptionRequest {
  message: Array<string>;
  error: string;
  statusCode: HttpStatus;
}

interface IExceptionConflict extends Omit<IExceptionRequest, 'message'> {
  message: Array<Reason>;
}

@Catch(HttpException)
export class MovementExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const reasons: Reason[] = [];
    if (exception instanceof BadRequestException) {
      (<IExceptionRequest>exception.getResponse()).message.forEach(
        (message) => {
          reasons.push({ reason: EReason.PARAMETER, detail: message });
        },
      );
    } else if (exception instanceof ConflictException) {
      reasons.push(...(<IExceptionConflict>exception.getResponse()).message);
    }

    return response.status(HttpStatus.I_AM_A_TEAPOT).json({
      message: `I'm a teapot`,
      reasons,
    });
  }
}
