import { EventType, NotificationType } from '@prisma/client';

export class EventReminderResponseDto {
  id: string;
  reminderDays: number;
  notificationTypes: NotificationType[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class EventResponseDto {
  id: string;
  title: string;
  eventDate: Date;
  eventType: EventType;
  personName: string;
  description?: string;
  recurringEvent: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  reminders: EventReminderResponseDto[];
}
