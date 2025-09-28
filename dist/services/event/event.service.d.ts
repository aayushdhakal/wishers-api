import { EventRepository } from '../../database/repositories/event.repository';
import { CreateEventDto, UpdateEventDto, EventResponseDto } from '../../modules/event/dto';
export declare class EventService {
    private readonly eventRepository;
    constructor(eventRepository: EventRepository);
    createEvent(userId: string, createEventDto: CreateEventDto): Promise<EventResponseDto>;
    getUserEvents(userId: string, options?: {
        page?: number;
        limit?: number;
        eventType?: string;
        startDate?: string;
        endDate?: string;
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
    deleteEvent(userId: string, eventId: string): Promise<void>;
    getEventsByDateRange(userId: string, startDate: string, endDate: string): Promise<EventResponseDto[]>;
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
}
