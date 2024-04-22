import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseFilters,
} from '@nestjs/common';
import { ApiAcceptedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ValidationDto } from '../dtos';
import { MovementExceptionsFilter } from '../filters';
import { MovementService } from '../services';

@ApiTags('movements')
@UseFilters(new MovementExceptionsFilter())
@Controller('movements')
export class MovementController {
  constructor(private movementService: MovementService) {}

  /**
   * Endpoint for validating movements against balances.
   *
   * @route POST /validation
   * @httpMethod POST
   * @statusCode 202
   *
   * @param {ValidationDto} body - The request body containing balances and movements to validate.
   * @param {Array<BalanceDto>} body.balances - The balances to validate against.
   * @param {Array<MovementDto>} body.movements - The movements to validate.
   *
   * @returns {{ message: 'Accepted' }} An object containing a message indicating the validation result.
   *
   * @throws {ConflictException} Throws a ConflictException if validation fails, with an array of errors.
   */
  @Post('validation')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse({
    description: 'Success validation',
  })
  @ApiResponse({
    status: HttpStatus.I_AM_A_TEAPOT,
    description: 'Any error detected during validation',
    schema: {
      example: { message: `I'm a teapot`, reasons: [] },
    },
  })
  public validation(@Body() { balances, movements }: ValidationDto) {
    const errors = this.movementService.validation(movements, balances);
    if (errors.length) {
      throw new ConflictException(errors);
    }
    return { message: 'Accepted' };
  }
}
