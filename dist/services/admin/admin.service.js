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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const event_repository_1 = require("../../database/repositories/event.repository");
let AdminService = class AdminService {
    constructor(eventRepository) {
        this.eventRepository = eventRepository;
    }
    async getUsersToContact(targetDate, eventType, reminderDays) {
        const target = targetDate || new Date();
        const eventsWithReminders = await this.eventRepository.findEventsNeedingRemindersWithUser(target);
        const contacts = [];
        const eventTypeCount = {};
        const reminderDaysCount = {};
        for (const event of eventsWithReminders) {
            for (const reminder of event.reminders) {
                if (!reminder.isActive)
                    continue;
                const reminderDate = new Date(event.eventDate);
                reminderDate.setDate(reminderDate.getDate() - reminder.reminderDays);
                const isSameDate = reminderDate.toDateString() === target.toDateString();
                if (isSameDate) {
                    if (eventType && event.eventType !== eventType.toUpperCase())
                        continue;
                    if (reminderDays && reminder.reminderDays !== reminderDays)
                        continue;
                    const contact = {
                        id: event.user.id,
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
                    };
                    contacts.push(contact);
                    eventTypeCount[event.eventType] = (eventTypeCount[event.eventType] || 0) + 1;
                    reminderDaysCount[reminder.reminderDays] = (reminderDaysCount[reminder.reminderDays] || 0) + 1;
                }
            }
        }
        return {
            contacts,
            total: contacts.length,
            targetDate: target,
            summary: {
                totalContacts: contacts.length,
                byEventType: eventTypeCount,
                byReminderDays: reminderDaysCount,
            },
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_repository_1.EventRepository])
], AdminService);
//# sourceMappingURL=admin.service.js.map