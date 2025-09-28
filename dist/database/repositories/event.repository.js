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
    async findByDateRange(userId, startDate, endDate) {
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
        });
    }
    async findByEventType(userId, eventType, options) {
        return this.prisma.event.findMany({
            where: {
                userId,
                isActive: true,
                eventType: eventType,
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
                isActive: true,
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
                },
            },
        });
    }
};
exports.EventRepository = EventRepository;
exports.EventRepository = EventRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EventRepository);
//# sourceMappingURL=event.repository.js.map