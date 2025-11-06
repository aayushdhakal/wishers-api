import { ConfigService } from '@nestjs/config';
import { NotificationType } from '@prisma/client';
import { MailService } from '../mail/mail.service';
export interface NotificationPayload {
    userId: string;
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    eventId: string;
    eventTitle: string;
    eventDate: Date;
    eventType: string;
    personName: string;
    reminderDays: number;
    notificationTypes: NotificationType[];
}
export interface NotificationResult {
    success: boolean;
    notificationType: NotificationType;
    message?: string;
    error?: string;
}
export declare class NotificationService {
    private readonly mailService;
    private readonly configService;
    private readonly logger;
    constructor(mailService: MailService, configService: ConfigService);
    sendNotifications(payload: NotificationPayload): Promise<NotificationResult[]>;
    private sendEmailNotification;
    private sendSmsNotification;
    private sendCallNotification;
    private sendPushNotification;
    private buildSmsMessage;
    private buildCallMessage;
    private buildPushNotificationBody;
    processReminderNotifications(contacts: any[]): Promise<{
        total: number;
        successful: number;
        failed: number;
        results: Array<{
            contact: any;
            notificationResults: NotificationResult[];
        }>;
    }>;
}
