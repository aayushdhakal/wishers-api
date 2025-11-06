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
var NotificationSchedulerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationSchedulerService = void 0;
const common_1 = require("@nestjs/common");
const event_repository_1 = require("../../database/repositories/event.repository");
const notification_service_1 = require("./notification.service");
let NotificationSchedulerService = NotificationSchedulerService_1 = class NotificationSchedulerService {
    constructor(eventRepository, notificationService) {
        this.eventRepository = eventRepository;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(NotificationSchedulerService_1.name);
    }
    async processDailyReminders() {
        this.logger.log('Starting daily reminder processing...');
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const contacts = await this.eventRepository.findUsersToContact(today);
            if (contacts.length === 0) {
                this.logger.log('No reminders to send today.');
                return;
            }
            this.logger.log(`Found ${contacts.length} reminder(s) to process.`);
            const result = await this.notificationService.processReminderNotifications(contacts);
            this.logger.log(`Reminder processing completed:`);
            this.logger.log(`  Total: ${result.total}`);
            this.logger.log(`  Successful: ${result.successful}`);
            this.logger.log(`  Failed: ${result.failed}`);
            result.results.forEach(({ contact, notificationResults }) => {
                const successCount = notificationResults.filter((r) => r.success).length;
                const failCount = notificationResults.filter((r) => !r.success).length;
                if (failCount > 0) {
                    this.logger.warn(`Event ${contact.eventTitle} (${contact.eventId}): ${successCount} succeeded, ${failCount} failed`);
                    notificationResults
                        .filter((r) => !r.success)
                        .forEach((r) => {
                        this.logger.error(`  - ${r.notificationType}: ${r.error}`);
                    });
                }
                else {
                    this.logger.log(`Event ${contact.eventTitle} (${contact.eventId}): All ${successCount} notification(s) sent successfully`);
                }
            });
        }
        catch (error) {
            this.logger.error(`Error processing daily reminders: ${error.message}`, error.stack);
        }
    }
    async processRemindersForDate(targetDate) {
        this.logger.log(`Processing reminders for date: ${targetDate.toDateString()}`);
        const contacts = await this.eventRepository.findUsersToContact(targetDate);
        if (contacts.length === 0) {
            this.logger.log('No reminders found for the specified date.');
            return {
                total: 0,
                successful: 0,
                failed: 0,
                results: [],
            };
        }
        const result = await this.notificationService.processReminderNotifications(contacts);
        return result;
    }
    async processTodayReminders() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        await this.processRemindersForDate(today);
    }
};
exports.NotificationSchedulerService = NotificationSchedulerService;
exports.NotificationSchedulerService = NotificationSchedulerService = NotificationSchedulerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_repository_1.EventRepository,
        notification_service_1.NotificationService])
], NotificationSchedulerService);
//# sourceMappingURL=notification-scheduler.service.js.map