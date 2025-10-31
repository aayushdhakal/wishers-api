"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventService = void 0;
const common_1 = require("@nestjs/common");
const event_repository_1 = require("../../database/repositories/event.repository");
let EventService = class EventService {
    constructor(eventRepository) {
        this.eventRepository = eventRepository;
    }
    async createEvent(userId, createEventDto) {
        const eventDate = new Date(createEventDto.eventDate);
        if (eventDate < new Date()) {
            throw new common_1.BadRequestException('Event date cannot be in the past');
        }
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
    async getMyCards(userId) {
        const events = await this.eventRepository.findByUserId(userId);
        return events.map((event) => this.mapEventToResponseDto(event));
    }
    async getUserEvents(userId, options) {
        const page = options?.page || 1;
        const limit = options?.limit || 10;
        const skip = (page - 1) * limit;
        let events;
        let total;
        if (options?.startDate && options?.endDate) {
            events = await this.eventRepository.findByDateRange(userId, new Date(options.startDate), new Date(options.endDate), {
                where: {
                    isActive: options.isActive,
                },
            });
            total = events.length;
        }
        else if (options?.eventType) {
            events = await this.eventRepository.findByEventType(userId, options.eventType, {
                skip,
                take: limit,
                where: {
                    isActive: options.isActive,
                },
            });
            total = await this.eventRepository.countUserEventsByType(userId, options.eventType);
        }
        else {
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
    async getUpcomingEvents(userId, limit = 5) {
        const events = await this.eventRepository.findUpcomingEvents(userId, limit);
        return events.map((event) => this.mapEventToResponseDto(event));
    }
    async getEventById(userId, eventId) {
        const event = await this.eventRepository.findByIdAndUserId(eventId, userId);
        if (!event) {
            throw new common_1.NotFoundException('Event not found');
        }
        return this.mapEventToResponseDto(event);
    }
    async updateEvent(userId, eventId, updateEventDto) {
        const existingEvent = await this.eventRepository.findByIdAndUserId(eventId, userId);
        if (!existingEvent) {
            throw new common_1.NotFoundException('Event not found');
        }
        if (updateEventDto.eventDate) {
            const eventDate = new Date(updateEventDto.eventDate);
            if (eventDate < new Date()) {
                throw new common_1.BadRequestException('Event date cannot be in the past');
            }
        }
        const updateData = { ...updateEventDto };
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
    async updateEventStatus(userId, eventId, updateEventDto) {
        const existingEvent = await this.eventRepository.findByIdAndUserId(eventId, userId);
        if (!existingEvent) {
            throw new common_1.NotFoundException('Event not found');
        }
        const updatedEvent = await this.eventRepository.updateEventStatus(eventId, updateEventDto);
        return this.mapEventToResponseDto(updatedEvent);
    }
    async deleteEvent(userId, eventId) {
        const event = await this.eventRepository.findByIdAndUserId(eventId, userId);
        if (!event) {
            throw new common_1.NotFoundException('Event not found');
        }
        await this.eventRepository.deleteEvent(eventId, userId);
    }
    async getEventsByDateRange(userId, startDate, endDate, options) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let start;
        let end;
        if (startDate) {
            start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            if (endDate) {
                end = new Date(endDate);
            }
            else {
                end = new Date(start);
                end.setDate(end.getDate() + 7);
            }
        }
        else {
            start = today;
            end = new Date(today);
            end.setDate(end.getDate() + 7);
        }
        end.setHours(23, 59, 59, 999);
        if (isNaN(start.getTime())) {
            throw new common_1.BadRequestException('Invalid start date format');
        }
        if (isNaN(end.getTime())) {
            throw new common_1.BadRequestException('Invalid end date format');
        }
        if (start >= end) {
            throw new common_1.BadRequestException('Start date must be before end date');
        }
        const events = await this.eventRepository.findByDateRange(userId, start, end, options);
        return events.map((event) => this.mapEventToResponseDto(event));
    }
    async getEventsByType(userId, eventType, options) {
        const page = options?.page || 1;
        const limit = options?.limit || 10;
        const skip = (page - 1) * limit;
        const events = await this.eventRepository.findByEventType(userId, eventType, {
            skip,
            take: limit,
        });
        const total = await this.eventRepository.countUserEvents(userId);
        return {
            events: events.map((event) => this.mapEventToResponseDto(event)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getUserEventStats(userId) {
        const totalEvents = await this.eventRepository.countUserEvents(userId);
        const upcomingEvents = await this.eventRepository.findUpcomingEvents(userId);
        const allEvents = await this.eventRepository.findByUserId(userId);
        const eventsByType = allEvents.reduce((acc, event) => {
            acc[event.eventType] = (acc[event.eventType] || 0) + 1;
            return acc;
        }, {});
        return {
            totalEvents,
            upcomingEvents: upcomingEvents.length,
            eventsByType,
        };
    }
    mapEventToResponseDto(event) {
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
    async getUserEventStatistics(userId) {
        const stats = await this.eventRepository.findMyCardsDetails(userId);
        return {
            ...stats,
            recentEvents: stats.recentEvents.map(event => this.mapEventToResponseDto(event)),
        };
    }
};
exports.EventService = EventService;
exports.EventService = EventService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_repository_1.EventRepository])
], EventService);
//# sourceMappingURL=event.service.js.map