import { Event, EventReminder, EventReminderNotification, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateEventDto, UpdateEventDto } from '../../modules/event/dto';
export type EventReminderWithNotifications = EventReminder & {
    notificationTypes: EventReminderNotification[];
};
export type EventWithReminders = Event & {
    reminders: EventReminderWithNotifications[];
};
export interface CreateEventData extends Omit<CreateEventDto, 'eventDate' | 'reminders'> {
    eventDate: Date;
    userId: string;
    reminders?: {
        reminderDays: number;
        notificationTypes: string[];
    }[];
}
export interface UpdateEventData extends Omit<UpdateEventDto, 'eventDate' | 'reminders'> {
    eventDate?: Date;
    reminders?: {
        reminderDays: number;
        notificationTypes: string[];
    }[];
}
export declare class EventRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createEvent(data: CreateEventData): Promise<EventWithReminders>;
    findById(id: string): Promise<EventWithReminders | null>;
    findByIdAndUserId(id: string, userId: string): Promise<EventWithReminders | null>;
    findByUserId(userId: string, options?: {
        skip?: number;
        take?: number;
        orderBy?: Prisma.EventOrderByWithRelationInput;
        where?: Prisma.EventWhereInput;
    }): Promise<EventWithReminders[]>;
    findUpcomingEvents(userId: string, limit?: number): Promise<EventWithReminders[]>;
    findByDateRange(userId: string, startDate: Date, endDate: Date): Promise<EventWithReminders[]>;
    findByEventType(userId: string, eventType: string, options?: {
        skip?: number;
        take?: number;
    }): Promise<EventWithReminders[]>;
    updateEvent(id: string, userId: string, data: UpdateEventData): Promise<EventWithReminders>;
    deleteEvent(id: string, userId: string): Promise<EventWithReminders>;
    hardDeleteEvent(id: string, userId: string): Promise<EventWithReminders>;
    countUserEvents(userId: string): Promise<number>;
    findEventsNeedingReminders(targetDate: Date): Promise<EventWithReminders[]>;
}
