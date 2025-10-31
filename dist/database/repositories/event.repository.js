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
exports.EventRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let EventRepository = class EventRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createEvent(data) {
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
                                    notificationType: type,
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
        });
    }
    async findMyCardsDetails(userId) {
        const now = new Date();
        const allEvents = await this.prisma.event.findMany({
            where: { userId },
            include: {
                reminders: {
                    include: {
                        notificationTypes: true,
                    },
                },
            },
        });
        const totalEvents = allEvents.length;
        const activeEvents = allEvents.filter(event => event.isActive).length;
        const inactiveEvents = allEvents.filter(event => !event.isActive).length;
        const upcomingEvents = allEvents.filter(event => event.eventDate > now && event.isActive).length;
        const pastEvents = allEvents.filter(event => event.eventDate <= now).length;
        const recurringEvents = allEvents.filter(event => event.recurringEvent && event.isActive).length;
        const eventsByType = {};
        allEvents.forEach(event => {
            if (event.eventType) {
                eventsByType[event.eventType] = (eventsByType[event.eventType] || 0) + 1;
            }
        });
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
    async findById(id) {
        return this.prisma.event.findUnique({
            where: { id },
            include: {
                reminders: {
                    include: {
                        notificationTypes: true,
                    },
                },
            },
        });
    }
    async findByIdAndUserId(id, userId) {
        return this.prisma.event.findFirst({
            where: { id, userId },
            include: {
                reminders: {
                    include: {
                        notificationTypes: true,
                    },
                },
            },
        });
    }
    async findByUserId(userId, options) {
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
        });
    }
    async findUpcomingEvents(userId, limit) {
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
    async findByDateRange(userId, startDate, endDate, options) {
        const whereClause = {
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
        });
    }
    async findByEventType(userId, eventType, options) {
        const normalizedEventType = eventType.toUpperCase();
        return this.prisma.event.findMany({
            where: {
                userId,
                eventType: normalizedEventType,
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
        });
    }
    async updateEvent(id, userId, data) {
        const { reminders, ...eventData } = data;
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
                                    notificationType: type,
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
        });
    }
    async updateEventStatus(id, data) {
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
        });
    }
    async deleteEvent(id, userId) {
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
        });
    }
    async hardDeleteEvent(id, userId) {
        return this.prisma.event.delete({
            where: { id },
            include: {
                reminders: {
                    include: {
                        notificationTypes: true,
                    },
                },
            },
        });
    }
    async countUserEvents(userId) {
        return this.prisma.event.count({
            where: {
                userId,
            },
        });
    }
    async countUserEventsByType(userId, eventType) {
        const normalizedEventType = eventType.toUpperCase();
        return this.prisma.event.count({
            where: {
                userId,
                eventType: normalizedEventType,
            },
        });
    }
    async findEventsNeedingReminders(targetDate) {
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
        });
    }
    async findUsersToContact(targetDate) {
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
                const reminderDate = new Date(event.eventDate);
                reminderDate.setDate(reminderDate.getDate() - reminder.reminderDays);
                const isSameDate = reminderDate.toDateString() === targetDate.toDateString();
                if (isSameDate) {
                    contactsToday.push({
                        userId: event.user.id,
                        email: event.user.email,
                        firstName: event.user.firstName,
                        lastName: event.user.lastName,
                        phone: event.user.phone,
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
};
exports.EventRepository = EventRepository;
exports.EventRepository = EventRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EventRepository);
//# sourceMappingURL=event.repository.js.map