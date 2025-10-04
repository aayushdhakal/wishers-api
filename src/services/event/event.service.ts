import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { EventRepository, EventWithReminders } from '../../database/repositories/event.repository';
import { CreateEventDto, UpdateEventDto, EventResponseDto, UpdateEventStatusDto } from '../../modules/event/dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class EventService {
  constructor(private readonly eventRepository: EventRepository) {}

  /**
   * Create a new event
   */
  async createEvent(userId: string, createEventDto: CreateEventDto): Promise<EventResponseDto> {
    const eventDate = new Date(createEventDto.eventDate);
    
    // Validate event date is not in the past
    if (eventDate < new Date()) {
      throw new BadRequestException('Event date cannot be in the past');
    }

    // Prepare reminders data
    const reminders = createEventDto.reminders?.map((reminder) => ({
      reminderDays: reminder.reminderDays,
      notificationTypes: reminder.notificationTypes,
    }));

    const event = await this.eventRepository.createEvent({
      ...createEventDto,
      eventDate,
      userId,
      reminders,
    });

    return this.mapEventToResponseDto(event);
  }

  /**
   * Get my cards details
   */
  async getMyCards(userId: string): Promise<EventResponseDto[]> {
    const events = await this.eventRepository.findByUserId(userId);
    return events.map((event) => this.mapEventToResponseDto(event));
  }

  /**
   * Get all events for a user
   */
  async getUserEvents(
    userId: string,
    options?: {
      page?: number;
      limit?: number;
      eventType?: string;
      startDate?: string;
      endDate?: string;
      isActive?: boolean;
    }
  ): Promise<{
    events: EventResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    let events: EventWithReminders[];
    let total: number;

    // Handle different filtering scenarios
    if (options?.startDate && options?.endDate) {
      events = await this.eventRepository.findByDateRange(
        userId,
        new Date(options.startDate),
        new Date(options.endDate),
        {
          where: {
            isActive: options.isActive,
          },
        }
      );
      total = events.length;
    } else if (options?.eventType) {
      events = await this.eventRepository.findByEventType(userId, options.eventType, {
        skip,
        take: limit,
        where: {
          isActive: options.isActive,
        },
      });
      total = await this.eventRepository.countUserEventsByType(userId, options.eventType);
    } else {
      events = await this.eventRepository.findByUserId(userId, {
        skip,
        take: limit,
        orderBy: { eventDate: 'asc' },
        where: {
          isActive: options.isActive,
        },
      });
      total = await this.eventRepository.countUserEvents(userId);
    }

    return {
      events: events.map((event) => this.mapEventToResponseDto(event)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get upcoming events for a user
   */
  async getUpcomingEvents(userId: string, limit = 5): Promise<EventResponseDto[]> {
    const events = await this.eventRepository.findUpcomingEvents(userId, limit);
    return events.map((event) => this.mapEventToResponseDto(event));
  }

  /**
   * Get event by ID
   */
  async getEventById(userId: string, eventId: string): Promise<EventResponseDto> {
    const event = await this.eventRepository.findByIdAndUserId(eventId, userId);
    
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return this.mapEventToResponseDto(event);
  }

  /**
   * Update an event
   */
  async updateEvent(
    userId: string,
    eventId: string,
    updateEventDto: UpdateEventDto
  ): Promise<EventResponseDto> {
    // Check if event exists and belongs to user
    const existingEvent = await this.eventRepository.findByIdAndUserId(eventId, userId);
    if (!existingEvent) {
      throw new NotFoundException('Event not found');
    }

    // Validate event date if provided
    if (updateEventDto.eventDate) {
      const eventDate = new Date(updateEventDto.eventDate);
      if (eventDate < new Date()) {
        throw new BadRequestException('Event date cannot be in the past');
      }
    }

    // Prepare update data
    const updateData: any = { ...updateEventDto };
    if (updateEventDto.eventDate) {
      updateData.eventDate = new Date(updateEventDto.eventDate);
    }
    if (updateEventDto.reminders) {
      updateData.reminders = updateEventDto.reminders.map((reminder) => ({
        reminderDays: reminder.reminderDays,
        notificationTypes: reminder.notificationTypes,
      }));
    }

    const updatedEvent = await this.eventRepository.updateEvent(eventId, userId, updateData);
    return this.mapEventToResponseDto(updatedEvent);
  }

  /**
   * Update an event status
   */
  async updateEventStatus(userId: string, eventId: string, updateEventDto: UpdateEventStatusDto): Promise<EventResponseDto> {
    const existingEvent = await this.eventRepository.findByIdAndUserId(eventId, userId);
    if (!existingEvent) {
      throw new NotFoundException('Event not found');
    }
    const updatedEvent = await this.eventRepository.updateEventStatus(eventId, updateEventDto);
    return this.mapEventToResponseDto(updatedEvent);
  }

  /**
   * Delete an event (soft delete)
   */
  async deleteEvent(userId: string, eventId: string): Promise<void> {
    const event = await this.eventRepository.findByIdAndUserId(eventId, userId);
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    await this.eventRepository.deleteEvent(eventId, userId);
  }

  /**
   * Get events by date range
   */
  async getEventsByDateRange(
    userId: string,
    startDate: string,
    endDate: string,
    options?: {
      where?: Prisma.EventWhereInput;
    }
  ): Promise<EventResponseDto[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      throw new BadRequestException('Start date must be before end date');
    }

    const events = await this.eventRepository.findByDateRange(userId, start, end, {
      where: {
        isActive: options.where?.isActive,
      }
    });
    return events.map((event) => this.mapEventToResponseDto(event));
  }

  /**
   * Get events by type
   */
  async getEventsByType(
    userId: string,
    eventType: string,
    options?: { page?: number; limit?: number }
  ): Promise<{
    events: EventResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const events = await this.eventRepository.findByEventType(userId, eventType, {
      skip,
      take: limit,
    });

    const total = await this.eventRepository.countUserEvents(userId); // Could be optimized

    return {
      events: events.map((event) => this.mapEventToResponseDto(event)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get user event statistics
   */
  async getUserEventStats(userId: string): Promise<{
    totalEvents: number;
    upcomingEvents: number;
    eventsByType: Record<string, number>;
  }> {
    const totalEvents = await this.eventRepository.countUserEvents(userId);
    const upcomingEvents = await this.eventRepository.findUpcomingEvents(userId);
    const allEvents = await this.eventRepository.findByUserId(userId);

    const eventsByType = allEvents.reduce((acc, event) => {
      acc[event.eventType] = (acc[event.eventType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalEvents,
      upcomingEvents: upcomingEvents.length,
      eventsByType,
    };
  }

  /**
   * Map Event entity to EventResponseDto
   */
  private mapEventToResponseDto(event: EventWithReminders): EventResponseDto {
    return {
      id: event.id,
      title: event.title,
      eventDate: event.eventDate,
      eventType: event.eventType,
      personName: event.personName,
      description: event.description,
      recurringEvent: event.recurringEvent,
      isActive: event.isActive,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
      userId: event.userId,
      reminders: event.reminders.map((reminder) => ({
        id: reminder.id,
        reminderDays: reminder.reminderDays,
        notificationTypes: reminder.notificationTypes.map((nt) => nt.notificationType),
        isActive: reminder.isActive,
        createdAt: reminder.createdAt,
        updatedAt: reminder.updatedAt,
      })),
    };
  }

  /**
   * Get comprehensive user event statistics
   */
  async getUserEventStatistics(userId: string): Promise<{
    totalEvents: number;
    activeEvents: number;
    inactiveEvents: number;
    upcomingEvents: number;
    pastEvents: number;
    recurringEvents: number;
    eventsByType: Record<string, number>;
    recentEvents: EventResponseDto[];
  }> {
    const stats = await this.eventRepository.findMyCardsDetails(userId);
    
    return {
      ...stats,
      recentEvents: stats.recentEvents.map(event => this.mapEventToResponseDto(event)),
    };
  }
}
