import { Module } from '@nestjs/common';

import { MovementController } from './controllers';
import { MovementService } from './services';

@Module({
  controllers: [MovementController],
  providers: [MovementService],
})
export class MovementModule {}
