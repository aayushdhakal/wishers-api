import { EventRepository } from '../../database/repositories/event.repository';
import { CreateEventDto, UpdateEventDto, EventResponseDto, UpdateEventStatusDto } from '../../modules/event/dto';
import { Prisma } from '@prisma/client';
export declare class EventService {
    private readonly eventRepository;
    constructor(eventRepository: EventRepository);
    createEvent(userId: string, createEventDto: CreateEventDto): Promise<EventResponseDto>;
    getMyCards(userId: string): Promise<EventResponseDto[]>;
    getUserEvents(userId: string, options?: {
        page?: number;
        limit?: number;
        eventType?: string;
        startDate?: string;
        endDate?: string;
        isActive?: boolean;
    }): Promise<{
        events: EventResponseDto[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getUpcomingEvents(userId: string, limit?: number): Promise<EventResponseDto[]>;
    getEventById(userId: string, eventId: string): Promise<EventResponseDto>;
    updateEvent(userId: string, eventId: string, updateEventDto: UpdateEventDto): Promise<EventResponseDto>;
    updateEventStatus(userId: string, eventId: string, updateEventDto: UpdateEventStatusDto): Promise<EventResponseDto>;
    deleteEvent(userId: string, eventId: string): Promise<void>;
    getEventsByDateRange(userId: string, startDate?: string, endDate?: string, options?: {
        where?: Prisma.EventWhereInput;
    }): Promise<EventResponseDto[]>;
    getEventsByType(userId: string, eventType: string, options?: {
        page?: number;
        limit?: number;
    }): Promise<{
        events: EventResponseDto[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getUserEventStats(userId: string): Promise<{
        totalEvents: number;
        upcomingEvents: number;
        eventsByType: Record<string, number>;
    }>;
    private mapEventToResponseDto;
    getUserEventStatistics(userId: string): Promise<{
        totalEvents: number;
        activeEvents: number;
        inactiveEvents: number;
        upcomingEvents: number;
        pastEvents: number;
        recurringEvents: number;
        eventsByType: Record<string, number>;
        recentEvents: EventResponseDto[];
    }>;
}
