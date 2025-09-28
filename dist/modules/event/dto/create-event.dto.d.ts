import { EventType, NotificationType } from '@prisma/client';
export declare class CreateEventReminderDto {
    reminderDays: number;
    notificationTypes: NotificationType[];
}
export declare class CreateEventDto {
    title: string;
    eventDate: string;
    eventType: EventType;
    personName: string;
    description?: string;
    recurringEvent?: boolean;
    reminders?: CreateEventReminderDto[];
}
