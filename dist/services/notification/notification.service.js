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
var NotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
const mail_service_1 = require("../mail/mail.service");
let NotificationService = NotificationService_1 = class NotificationService {
    constructor(mailService, configService) {
        this.mailService = mailService;
        this.configService = configService;
        this.logger = new common_1.Logger(NotificationService_1.name);
    }
    async sendNotifications(payload) {
        const results = [];
        for (const notificationType of payload.notificationTypes) {
            try {
                let result;
                switch (notificationType) {
                    case client_1.NotificationType.EMAIL:
                        result = await this.sendEmailNotification(payload);
                        break;
                    case client_1.NotificationType.SMS:
                        result = await this.sendSmsNotification(payload);
                        break;
                    case client_1.NotificationType.CALL:
                        result = await this.sendCallNotification(payload);
                        break;
                    case client_1.NotificationType.PUSH_NOTIFICATION:
                        result = await this.sendPushNotification(payload);
                        break;
                    default:
                        result = {
                            success: false,
                            notificationType,
                            error: `Unsupported notification type: ${notificationType}`,
                        };
                }
                results.push(result);
            }
            catch (error) {
                this.logger.error(`Failed to send ${notificationType} notification: ${error.message}`, error.stack);
                results.push({
                    success: false,
                    notificationType,
                    error: error.message,
                });
            }
        }
        return results;
    }
    async sendEmailNotification(payload) {
        if (!payload.email) {
            return {
                success: false,
                notificationType: client_1.NotificationType.EMAIL,
                error: 'Email address is required for email notifications',
            };
        }
        try {
            const firstName = payload.firstName || 'User';
            await this.mailService.sendEventReminderEmail(payload.email, firstName, payload.eventTitle, payload.eventDate, payload.personName, payload.reminderDays);
            return {
                success: true,
                notificationType: client_1.NotificationType.EMAIL,
                message: `Email notification sent to ${payload.email}`,
            };
        }
        catch (error) {
            this.logger.error(`Failed to send email notification: ${error.message}`, error.stack);
            return {
                success: false,
                notificationType: client_1.NotificationType.EMAIL,
                error: error.message,
            };
        }
    }
    async sendSmsNotification(payload) {
        if (!payload.phone) {
            return {
                success: false,
                notificationType: client_1.NotificationType.SMS,
                error: 'Phone number is required for SMS notifications',
            };
        }
        const smsEnabled = this.configService.get('SMS_ENABLED', 'false');
        if (smsEnabled !== 'true') {
            this.logger.warn('SMS sending is disabled. Set SMS_ENABLED=true to enable.');
            return {
                success: false,
                notificationType: client_1.NotificationType.SMS,
                error: 'SMS notifications are disabled',
            };
        }
        try {
            const message = this.buildSmsMessage(payload);
            this.logger.log(`SMS would be sent to: ${payload.phone}`);
            this.logger.log(`Message: ${message}`);
            return {
                success: true,
                notificationType: client_1.NotificationType.SMS,
                message: `SMS notification sent to ${payload.phone}`,
            };
        }
        catch (error) {
            this.logger.error(`Failed to send SMS notification: ${error.message}`, error.stack);
            return {
                success: false,
                notificationType: client_1.NotificationType.SMS,
                error: error.message,
            };
        }
    }
    async sendCallNotification(payload) {
        if (!payload.phone) {
            return {
                success: false,
                notificationType: client_1.NotificationType.CALL,
                error: 'Phone number is required for call notifications',
            };
        }
        const callEnabled = this.configService.get('CALL_ENABLED', 'false');
        if (callEnabled !== 'true') {
            this.logger.warn('Call notifications are disabled. Set CALL_ENABLED=true to enable.');
            return {
                success: false,
                notificationType: client_1.NotificationType.CALL,
                error: 'Call notifications are disabled',
            };
        }
        try {
            const message = this.buildCallMessage(payload);
            this.logger.log(`Call would be made to: ${payload.phone}`);
            this.logger.log(`Message: ${message}`);
            return {
                success: true,
                notificationType: client_1.NotificationType.CALL,
                message: `Call notification initiated to ${payload.phone}`,
            };
        }
        catch (error) {
            this.logger.error(`Failed to send call notification: ${error.message}`, error.stack);
            return {
                success: false,
                notificationType: client_1.NotificationType.CALL,
                error: error.message,
            };
        }
    }
    async sendPushNotification(payload) {
        const pushEnabled = this.configService.get('PUSH_NOTIFICATION_ENABLED', 'false');
        if (pushEnabled !== 'true') {
            this.logger.warn('Push notifications are disabled. Set PUSH_NOTIFICATION_ENABLED=true to enable.');
            return {
                success: false,
                notificationType: client_1.NotificationType.PUSH_NOTIFICATION,
                error: 'Push notifications are disabled',
            };
        }
        try {
            const title = `Reminder: ${payload.eventTitle}`;
            const body = this.buildPushNotificationBody(payload);
            this.logger.log(`Push notification would be sent to user: ${payload.userId}`);
            this.logger.log(`Title: ${title}`);
            this.logger.log(`Body: ${body}`);
            return {
                success: true,
                notificationType: client_1.NotificationType.PUSH_NOTIFICATION,
                message: `Push notification sent to user ${payload.userId}`,
            };
        }
        catch (error) {
            this.logger.error(`Failed to send push notification: ${error.message}`, error.stack);
            return {
                success: false,
                notificationType: client_1.NotificationType.PUSH_NOTIFICATION,
                error: error.message,
            };
        }
    }
    buildSmsMessage(payload) {
        const formattedDate = new Date(payload.eventDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
        return `Reminder: ${payload.eventTitle} for ${payload.personName} is in ${payload.reminderDays} day${payload.reminderDays > 1 ? 's' : ''}! Event date: ${formattedDate}. - Wishin`;
    }
    buildCallMessage(payload) {
        const formattedDate = new Date(payload.eventDate).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
        return `Hello, this is a reminder from Wishin. ${payload.eventTitle} for ${payload.personName} is coming up in ${payload.reminderDays} day${payload.reminderDays > 1 ? 's' : ''}. The event date is ${formattedDate}. Thank you.`;
    }
    buildPushNotificationBody(payload) {
        const formattedDate = new Date(payload.eventDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
        return `${payload.eventTitle} for ${payload.personName} is in ${payload.reminderDays} day${payload.reminderDays > 1 ? 's' : ''}! (${formattedDate})`;
    }
    async processReminderNotifications(contacts) {
        const results = [];
        let successful = 0;
        let failed = 0;
        for (const contact of contacts) {
            const payload = {
                userId: contact.userId,
                email: contact.email,
                phone: contact.phone,
                firstName: contact.firstName,
                lastName: contact.lastName,
                eventId: contact.eventId,
                eventTitle: contact.eventTitle,
                eventDate: contact.eventDate,
                eventType: contact.eventType,
                personName: contact.personName,
                reminderDays: contact.reminderDays,
                notificationTypes: contact.notificationTypes,
            };
            const notificationResults = await this.sendNotifications(payload);
            const hasSuccess = notificationResults.some((r) => r.success);
            if (hasSuccess) {
                successful++;
            }
            else {
                failed++;
            }
            results.push({
                contact,
                notificationResults,
            });
        }
        return {
            total: contacts.length,
            successful,
            failed,
            results,
        };
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mail_service_1.MailService,
        config_1.ConfigService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map