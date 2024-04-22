import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsString } from 'class-validator';

import { Movement } from '../models';

export class MovementDto implements Movement {
  @ApiProperty()
  @IsNumber()
  readonly id: number;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  readonly date: Date;

  @ApiProperty()
  @IsString()
  readonly wording: string;

  @ApiProperty()
  @IsNumber()
  readonly amount: number;
}
