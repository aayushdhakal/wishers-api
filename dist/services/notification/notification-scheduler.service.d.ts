import { EventRepository } from '../../database/repositories/event.repository';
import { NotificationService } from './notification.service';
export declare class NotificationSchedulerService {
    private readonly eventRepository;
    private readonly notificationService;
    private readonly logger;
    constructor(eventRepository: EventRepository, notificationService: NotificationService);
    processDailyReminders(): Promise<void>;
    processRemindersForDate(targetDate: Date): Promise<{
        total: number;
        successful: number;
        failed: number;
        results: any[];
    }>;
    processTodayReminders(): Promise<void>;
}
