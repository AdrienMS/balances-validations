import { Module } from '@nestjs/common';

import { MovementModule } from './movement/movement.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [MovementModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
