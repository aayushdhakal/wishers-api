import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { EventController } from './controllers/event.controller';
import { EventService } from '../../services/event/event.service';
import { EventRepository } from '../../database/repositories/event.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [EventController],
  providers: [EventService, EventRepository],
  exports: [EventService, EventRepository],
})
export class EventModule {}
