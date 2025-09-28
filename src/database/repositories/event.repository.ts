import { Injectable } from '@nestjs/common';
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

@Injectable()
export class EventRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new event with reminders
   */
  async createEvent(data: CreateEventData): Promise<EventWithReminders> {
    const { reminders, ...eventData } = data;

    return this.prisma.event.create({
      data: {
        ...eventData,
        reminders: reminders
          ? {
              create: reminders.map((reminder) => ({
                reminderDays: reminder.reminderDays,
                notificationTypes: {
                  create: reminder.notificationTypes.map((type) => ({
                    notificationType: type as any,
                  })),
                },
              })),
            }
          : undefined,
      },
      include: {
        reminders: {
          include: {
            notificationTypes: true,
          },
        },
      },
    }) as Promise<EventWithReminders>;
  }

  /**
   * Find event by ID
   */
  async findById(id: string): Promise<EventWithReminders | null> {
    return this.prisma.event.findUnique({
      where: { id },
      include: {
        reminders: {
          include: {
            notificationTypes: true,
          },
        },
      },
    }) as Promise<EventWithReminders | null>;
  }

  /**
   * Find event by ID and user ID
   */
  async findByIdAndUserId(id: string, userId: string): Promise<EventWithReminders | null> {
    return this.prisma.event.findFirst({
      where: { id, userId },
      include: {
        reminders: {
          include: {
            notificationTypes: true,
          },
        },
      },
    }) as Promise<EventWithReminders | null>;
  }

  /**
   * Find all events for a user
   */
  async findByUserId(
    userId: string,
    options?: {
      skip?: number;
      take?: number;
      orderBy?: Prisma.EventOrderByWithRelationInput;
      where?: Prisma.EventWhereInput;
    }
  ): Promise<EventWithReminders[]> {
    return this.prisma.event.findMany({
      where: {
        userId,
        isActive: true,
        ...options?.where,
      },
      include: {
        reminders: {
          include: {
            notificationTypes: true,
          },
        },
      },
      skip: options?.skip,
      take: options?.take,
      orderBy: options?.orderBy || { eventDate: 'asc' },
    }) as Promise<EventWithReminders[]>;
  }

  /**
   * Find upcoming events for a user
   */
  async findUpcomingEvents(userId: string, limit?: number): Promise<EventWithReminders[]> {
    return this.prisma.event.findMany({
      where: {
        userId,
        isActive: true,
        eventDate: {
          gte: new Date(),
        },
      },
      include: {
        reminders: {
          include: {
            notificationTypes: true,
          },
        },
      },
      orderBy: {
        eventDate: 'asc',
      },
      take: limit,
    });
  }

  /**
   * Find events by date range
   */
  async findByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<EventWithReminders[]> {
    return this.prisma.event.findMany({
      where: {
        userId,
        isActive: true,
        eventDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        reminders: {
          include: {
            notificationTypes: true,
          },
        },
      },
      orderBy: {
        eventDate: 'asc',
      },
    }) as Promise<EventWithReminders[]>;
  }

  /**
   * Find events by type
   */
  async findByEventType(
    userId: string,
    eventType: string,
    options?: {
      skip?: number;
      take?: number;
    }
  ): Promise<EventWithReminders[]> {
    return this.prisma.event.findMany({
      where: {
        userId,
        isActive: true,
        eventType: eventType as any,
      },
      include: {
        reminders: {
          include: {
            notificationTypes: true,
          },
        },
      },
      orderBy: {
        eventDate: 'asc',
      },
      skip: options?.skip,
      take: options?.take,
    });
  }

  /**
   * Update event
   */
  async updateEvent(id: string, userId: string, data: UpdateEventData): Promise<EventWithReminders> {
    const { reminders, ...eventData } = data;

    // If reminders are provided, delete existing ones and create new ones
    if (reminders !== undefined) {
      await this.prisma.eventReminder.deleteMany({
        where: { eventId: id },
      });
    }

    return this.prisma.event.update({
      where: { id },
      data: {
        ...eventData,
        reminders: reminders
          ? {
              create: reminders.map((reminder) => ({
                reminderDays: reminder.reminderDays,
                notificationTypes: {
                  create: reminder.notificationTypes.map((type) => ({
                    notificationType: type as any,
                  })),
                },
              })),
            }
          : undefined,
      },
      include: {
        reminders: {
          include: {
            notificationTypes: true,
          },
        },
      },
    }) as Promise<EventWithReminders>;
  }

  /**
   * Soft delete event (set isActive to false)
   */
  async deleteEvent(id: string, userId: string): Promise<EventWithReminders> {
    return this.prisma.event.update({
      where: { id },
      data: { isActive: false },
      include: {
        reminders: {
          include: {
            notificationTypes: true,
          },
        },
      },
    }) as Promise<EventWithReminders>;
  }

  /**
   * Hard delete event (permanently remove)
   */
  async hardDeleteEvent(id: string, userId: string): Promise<EventWithReminders> {
    return this.prisma.event.delete({
      where: { id },
      include: {
        reminders: {
          include: {
            notificationTypes: true,
          },
        },
      },
    }) as Promise<EventWithReminders>;
  }

  /**
   * Count events for a user
   */
  async countUserEvents(userId: string): Promise<number> {
    return this.prisma.event.count({
      where: {
        userId,
        isActive: true,
      },
    });
  }

  /**
   * Find events that need reminders (for notification service)
   */
  async findEventsNeedingReminders(targetDate: Date): Promise<EventWithReminders[]> {
    return this.prisma.event.findMany({
      where: {
        isActive: true,
        eventDate: {
          gte: targetDate,
        },
        reminders: {
          some: {
            isActive: true,
          },
        },
      },
      include: {
        reminders: {
          where: {
            isActive: true,
          },
        },
      },
    }) as Promise<EventWithReminders[]>;
  }
}
