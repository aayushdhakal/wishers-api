import { Injectable, Logger } from '@nestjs/common';
import { EventRepository } from '../../database/repositories/event.repository';
import { NotificationService } from './notification.service';

// Note: To enable cron jobs, install @nestjs/schedule:
// npm install @nestjs/schedule
// Then uncomment the imports and @Cron decorator below
// import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class NotificationSchedulerService {
  private readonly logger = new Logger(NotificationSchedulerService.name);

  constructor(
    private readonly eventRepository: EventRepository,
    private readonly notificationService: NotificationService,
  ) {}

  /**
   * Process reminders daily at 9:00 AM
   * This cron job runs every day and checks for reminders that need to be sent
   * 
   * To enable automatic scheduling:
   * 1. Install @nestjs/schedule: npm install @nestjs/schedule
   * 2. Import ScheduleModule in NotificationModule
   * 3. Uncomment the @Cron decorator below
   */
  // @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async processDailyReminders(): Promise<void> {
    this.logger.log('Starting daily reminder processing...');
    
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Find all users who need reminders today
      const contacts = await this.eventRepository.findUsersToContact(today);

      if (contacts.length === 0) {
        this.logger.log('No reminders to send today.');
        return;
      }

      this.logger.log(`Found ${contacts.length} reminder(s) to process.`);

      // Process and send notifications
      const result = await this.notificationService.processReminderNotifications(contacts);

      this.logger.log(`Reminder processing completed:`);
      this.logger.log(`  Total: ${result.total}`);
      this.logger.log(`  Successful: ${result.successful}`);
      this.logger.log(`  Failed: ${result.failed}`);

      // Log detailed results
      result.results.forEach(({ contact, notificationResults }) => {
        const successCount = notificationResults.filter((r) => r.success).length;
        const failCount = notificationResults.filter((r) => !r.success).length;

        if (failCount > 0) {
          this.logger.warn(
            `Event ${contact.eventTitle} (${contact.eventId}): ${successCount} succeeded, ${failCount} failed`,
          );
          notificationResults
            .filter((r) => !r.success)
            .forEach((r) => {
              this.logger.error(`  - ${r.notificationType}: ${r.error}`);
            });
        } else {
          this.logger.log(
            `Event ${contact.eventTitle} (${contact.eventId}): All ${successCount} notification(s) sent successfully`,
          );
        }
      });
    } catch (error) {
      this.logger.error(`Error processing daily reminders: ${error.message}`, error.stack);
    }
  }

  /**
   * Process reminders for a specific date (manual trigger)
   */
  async processRemindersForDate(targetDate: Date): Promise<{
    total: number;
    successful: number;
    failed: number;
    results: any[];
  }> {
    this.logger.log(`Processing reminders for date: ${targetDate.toDateString()}`);

    const contacts = await this.eventRepository.findUsersToContact(targetDate);

    if (contacts.length === 0) {
      this.logger.log('No reminders found for the specified date.');
      return {
        total: 0,
        successful: 0,
        failed: 0,
        results: [],
      };
    }

    const result = await this.notificationService.processReminderNotifications(contacts);

    return result;
  }

  /**
   * Process reminders for today (manual trigger)
   */
  async processTodayReminders(): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    await this.processRemindersForDate(today);
  }
}

