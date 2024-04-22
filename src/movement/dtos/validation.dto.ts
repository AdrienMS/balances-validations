import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';

import { MovementDto } from './movement.dto';
import { BalanceDto } from './balance.dto';

export class ValidationDto {
  @ApiProperty({ type: [MovementDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MovementDto)
  readonly movements: MovementDto[];

  @ApiProperty({ type: [BalanceDto], minimum: 2 })
  @IsArray()
  @ArrayMinSize(2)
  @ValidateNested({ each: true })
  @Type(() => BalanceDto)
  readonly balances: BalanceDto[];
}
