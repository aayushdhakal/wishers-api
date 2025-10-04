import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { ExportController } from './controllers/export.controller';
import { ExportService } from '../../services/export/export.service';
import { EventRepository } from '../../database/repositories/event.repository';
import { UserRepository } from '../../database/repositories/user.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [ExportController],
  providers: [ExportService, EventRepository, UserRepository],
  exports: [ExportService],
})
export class ExportModule {}
