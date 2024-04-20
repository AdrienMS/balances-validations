import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseFilters,
} from '@nestjs/common';

import { ValidationDto } from '../dtos';
import { MovementExceptionsFilter } from '../filters';
import { MovementService } from '../services';

@UseFilters(new MovementExceptionsFilter())
@Controller('movements')
export class MovementController {
  constructor(private movementService: MovementService) {}

  @Post('validation')
  @HttpCode(HttpStatus.ACCEPTED)
  public validation(@Body() { balances, movements }: ValidationDto) {
    const errors = this.movementService.validation(movements, balances);
    if (errors.length) {
      throw new ConflictException(errors);
    }
    return { message: 'Accepted' };
  }
}
