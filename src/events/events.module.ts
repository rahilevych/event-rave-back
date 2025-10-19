import { DatabaseModule } from './../database/database.module';
import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';

@Module({
  imports: [DatabaseModule],
  providers: [EventsService],
  controllers: [EventsController],
})
export class EventsModule {}
