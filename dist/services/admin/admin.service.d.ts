import { EventRepository } from '../../database/repositories/event.repository';
import { ReminderContactListDto } from '../../modules/admin/dto';
export declare class AdminService {
    private readonly eventRepository;
    constructor(eventRepository: EventRepository);
    getUsersToContact(targetDate?: Date, eventType?: string, reminderDays?: number): Promise<ReminderContactListDto>;
}
