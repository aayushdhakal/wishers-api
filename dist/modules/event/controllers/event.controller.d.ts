import { EventService } from '../../../services/event/event.service';
import { CreateEventDto, UpdateEventDto, EventResponseDto, UpdateEventStatusDto } from '../dto';
import { User } from '@prisma/client';
export declare class EventController {
    private readonly eventService;
    constructor(eventService: EventService);
    createEvent(user: User, createEventDto: CreateEventDto): Promise<EventResponseDto>;
    getUserEvents(user: User, page?: number, limit?: number, eventType?: string, startDate?: string, endDate?: string, isActive?: boolean): Promise<{
        events: EventResponseDto[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getUpcomingEvents(user: User, limit: number): Promise<EventResponseDto[]>;
    getUserEventStats(user: User): Promise<{
        totalEvents: number;
        activeEvents: number;
        inactiveEvents: number;
        upcomingEvents: number;
        pastEvents: number;
        recurringEvents: number;
        eventsByType: Record<string, number>;
        recentEvents: EventResponseDto[];
    }>;
    getMyCardsDetails(user: User): Promise<{
        totalEvents: number;
        activeEvents: number;
        inactiveEvents: number;
        upcomingEvents: number;
        pastEvents: number;
        recurringEvents: number;
        eventsByType: Record<string, number>;
        recentEvents: EventResponseDto[];
    }>;
    getEventsByDateRange(user: User, startDate?: string, endDate?: string): Promise<EventResponseDto[]>;
    getEventsByType(user: User, eventType: string, page: number, limit: number): Promise<{
        events: EventResponseDto[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getEventById(user: User, eventId: string): Promise<EventResponseDto>;
    updateEvent(user: User, eventId: string, updateEventDto: UpdateEventDto): Promise<EventResponseDto>;
    updateEventStatus(user: User, eventId: string, updateEventDto: UpdateEventStatusDto): Promise<EventResponseDto>;
    deleteEvent(user: User, eventId: string): Promise<void>;
}
