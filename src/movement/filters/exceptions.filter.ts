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

/**
 * Exception filter for handling HTTP exceptions related to movements.
 *
 * This filter catches instances of HttpException and processes them accordingly,
 * returning an appropriate response based on the specific exception type.
 *
 * @catch HttpException
 */
@Catch(HttpException)
export class MovementExceptionsFilter implements ExceptionFilter {
  /**
   * Handles the caught HTTP exception.
   * There is a check for the type of the exception :
   * - BadRequestException : throw by DTO and have multiple messages.
   * For each messages, format them correctly.
   * - ConflictException : throw by MovementController and already correctly formatted.
   * - Other exceptions : For other exceptions, an unknown error is returned.
   *
   * @param {HttpException} exception - The caught HTTP exception.
   * @param {ArgumentsHost} host - The host object containing the execution context.
   *
   * @returns {Response} The HTTP response containing the error details.
   */
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
    } else {
      reasons.push({ reason: EReason.UNKNOW_ERROR });
    }

    return response.status(HttpStatus.I_AM_A_TEAPOT).json({
      message: `I'm a teapot`,
      reasons,
    });
  }
}
