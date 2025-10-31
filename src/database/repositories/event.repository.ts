import { Injectable } from '@nestjs/common';
import { Event, EventReminder, EventReminderNotification, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateEventDto, UpdateEventDto, UpdateEventStatusDto } from '../../modules/event/dto';

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
   * Find my cards details - comprehensive user event statistics
   */
  async findMyCardsDetails(userId: string): Promise<{
    totalEvents: number;
    activeEvents: number;
    inactiveEvents: number;
    upcomingEvents: number;
    pastEvents: number;
    recurringEvents: number;
    eventsByType: Record<string, number>;
    recentEvents: EventWithReminders[];
  }> {
    const now = new Date();
    
    // Get all user events
    const allEvents = await this.prisma.event.findMany({
      where: { userId },
      include: {
        reminders: {
          include: {
            notificationTypes: true,
          },
        },
      },
    }) as EventWithReminders[];

    // Calculate statistics
    const totalEvents = allEvents.length;
    const activeEvents = allEvents.filter(event => event.isActive).length;
    const inactiveEvents = allEvents.filter(event => !event.isActive).length;
    const upcomingEvents = allEvents.filter(event => event.eventDate > now && event.isActive).length;
    const pastEvents = allEvents.filter(event => event.eventDate <= now).length;
    const recurringEvents = allEvents.filter(event => event.recurringEvent && event.isActive).length;

    // Group events by type
    const eventsByType: Record<string, number> = {};
    allEvents.forEach(event => {
      if (event.eventType) {
        eventsByType[event.eventType] = (eventsByType[event.eventType] || 0) + 1;
      }
    });

    // Get recent events (last 10 active events)
    const recentEvents = allEvents
      .filter(event => event.isActive)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 10);

    return {
      totalEvents,
      activeEvents,
      inactiveEvents,
      upcomingEvents,
      pastEvents,
      recurringEvents,
      eventsByType,
      recentEvents,
    };
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
    endDate: Date,
    options?: {
      where?: Prisma.EventWhereInput;
    }
  ): Promise<EventWithReminders[]> {
    const whereClause: Prisma.EventWhereInput = {
      userId,
      eventDate: {
        gte: startDate,
        lte: endDate,
      },
      ...(options?.where && { ...options.where }),
    };

    return this.prisma.event.findMany({
      where: whereClause,
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
      where?: Prisma.EventWhereInput;
    }
  ): Promise<EventWithReminders[]> {
    // Convert to uppercase to match the enum
    const normalizedEventType = eventType.toUpperCase();
    
    return this.prisma.event.findMany({
      where: {
        userId,
        eventType: normalizedEventType as any,
        ...options?.where,
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
    }) as Promise<EventWithReminders[]>;
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
   * Update event status
   */
  async updateEventStatus(id: string, data: UpdateEventStatusDto): Promise<EventWithReminders> {
    return this.prisma.event.update({
      where: { id },
      data: { isActive: data.isActive },
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
      },
    });
  }

  /**
   * Count user events by type
   */
  async countUserEventsByType(userId: string, eventType: string): Promise<number> {
    const normalizedEventType = eventType.toUpperCase();
    
    return this.prisma.event.count({
      where: {
        userId,
        eventType: normalizedEventType as any,
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
          include: {
            notificationTypes: true,
          },
        },
      },
    }) as Promise<EventWithReminders[]>;
  }

  /**
   * Find users to contact based on reminder target date
   */
  async findUsersToContact(targetDate: Date): Promise<any[]> {
    const events = await this.prisma.event.findMany({
      where: {
        isActive: true,
        reminders: {
          some: {
            isActive: true,
          },
        },
      },
      include: {
        user: true,
        reminders: {
          where: {
            isActive: true,
          },
          include: {
            notificationTypes: true,
          },
        },
      },
    });

    const contactsToday = [];

    for (const event of events) {
      for (const reminder of event.reminders) {
        // Calculate when this reminder should be sent
        const reminderDate = new Date(event.eventDate);
        reminderDate.setDate(reminderDate.getDate() - reminder.reminderDays);
        
        // Check if this reminder should be sent on the target date
        const isSameDate = reminderDate.toDateString() === targetDate.toDateString();
        
        if (isSameDate) {
          contactsToday.push({
            userId: event.user.id,
            email: event.user.email,
            firstName: event.user.firstName,
            lastName: event.user.lastName,
            phone: (event.user as any).phone,
            eventId: event.id,
            eventTitle: event.title,
            eventDate: event.eventDate,
            eventType: event.eventType,
            personName: event.personName,
            reminderDays: reminder.reminderDays,
            notificationTypes: reminder.notificationTypes.map(nt => nt.notificationType),
            targetDate: reminderDate,
          });
        }
      }
    }

    return contactsToday;
  }
}
