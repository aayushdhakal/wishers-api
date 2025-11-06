import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { EventRepository } from '../../database/repositories/event.repository';
import { MailService } from '../../services/mail/mail.service';
import { NotificationService } from '../../services/notification/notification.service';
import { NotificationSchedulerService } from '../../services/notification/notification-scheduler.service';

// To enable cron jobs, install @nestjs/schedule and uncomment:
// import { ScheduleModule } from '@nestjs/schedule';
// Then add ScheduleModule.forRoot() to imports array

@Module({
  imports: [
    DatabaseModule,
    // Uncomment after installing @nestjs/schedule:
    // ScheduleModule.forRoot(),
  ],
  providers: [
    MailService,
    EventRepository,
    NotificationService,
    NotificationSchedulerService,
  ],
  exports: [
    NotificationService,
    NotificationSchedulerService,
  ],
})
export class NotificationModule {}

