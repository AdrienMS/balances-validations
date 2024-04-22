import { ApiProperty } from '@nestjs/swagger';

import { IsDate, IsNumber } from 'class-validator';

import { Balance } from '../models';

export class BalanceDto implements Balance {
  @ApiProperty()
  @IsDate()
  readonly date: Date;

  @ApiProperty()
  @IsNumber()
  readonly balance: number;
}
