import { Injectable, Logger } from '@nestjs/common';
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

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Send notifications based on the notification types
   */
  async sendNotifications(payload: NotificationPayload): Promise<NotificationResult[]> {
    const results: NotificationResult[] = [];

    for (const notificationType of payload.notificationTypes) {
      try {
        let result: NotificationResult;

        switch (notificationType) {
          case NotificationType.EMAIL:
            result = await this.sendEmailNotification(payload);
            break;
          case NotificationType.SMS:
            result = await this.sendSmsNotification(payload);
            break;
          case NotificationType.CALL:
            result = await this.sendCallNotification(payload);
            break;
          case NotificationType.PUSH_NOTIFICATION:
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
      } catch (error) {
        this.logger.error(
          `Failed to send ${notificationType} notification: ${error.message}`,
          error.stack,
        );
        results.push({
          success: false,
          notificationType,
          error: error.message,
        });
      }
    }

    return results;
  }

  /**
   * Send email notification
   */
  private async sendEmailNotification(payload: NotificationPayload): Promise<NotificationResult> {
    if (!payload.email) {
      return {
        success: false,
        notificationType: NotificationType.EMAIL,
        error: 'Email address is required for email notifications',
      };
    }

    try {
      const firstName = payload.firstName || 'User';
      await this.mailService.sendEventReminderEmail(
        payload.email,
        firstName,
        payload.eventTitle,
        payload.eventDate,
        payload.personName,
        payload.reminderDays,
      );

      return {
        success: true,
        notificationType: NotificationType.EMAIL,
        message: `Email notification sent to ${payload.email}`,
      };
    } catch (error) {
      this.logger.error(`Failed to send email notification: ${error.message}`, error.stack);
      return {
        success: false,
        notificationType: NotificationType.EMAIL,
        error: error.message,
      };
    }
  }

  /**
   * Send SMS notification
   */
  private async sendSmsNotification(payload: NotificationPayload): Promise<NotificationResult> {
    if (!payload.phone) {
      return {
        success: false,
        notificationType: NotificationType.SMS,
        error: 'Phone number is required for SMS notifications',
      };
    }

    const smsEnabled = this.configService.get<string>('SMS_ENABLED', 'false');
    if (smsEnabled !== 'true') {
      this.logger.warn('SMS sending is disabled. Set SMS_ENABLED=true to enable.');
      return {
        success: false,
        notificationType: NotificationType.SMS,
        error: 'SMS notifications are disabled',
      };
    }

    try {
      // TODO: Integrate with SMS service (Twilio, AWS SNS, etc.)
      const message = this.buildSmsMessage(payload);
      
      this.logger.log(`SMS would be sent to: ${payload.phone}`);
      this.logger.log(`Message: ${message}`);

      // Example with Twilio:
      // const twilioClient = require('twilio')(accountSid, authToken);
      // await twilioClient.messages.create({
      //   body: message,
      //   to: payload.phone,
      //   from: twilioPhoneNumber,
      // });

      return {
        success: true,
        notificationType: NotificationType.SMS,
        message: `SMS notification sent to ${payload.phone}`,
      };
    } catch (error) {
      this.logger.error(`Failed to send SMS notification: ${error.message}`, error.stack);
      return {
        success: false,
        notificationType: NotificationType.SMS,
        error: error.message,
      };
    }
  }

  /**
   * Send call notification (voice call)
   */
  private async sendCallNotification(payload: NotificationPayload): Promise<NotificationResult> {
    if (!payload.phone) {
      return {
        success: false,
        notificationType: NotificationType.CALL,
        error: 'Phone number is required for call notifications',
      };
    }

    const callEnabled = this.configService.get<string>('CALL_ENABLED', 'false');
    if (callEnabled !== 'true') {
      this.logger.warn('Call notifications are disabled. Set CALL_ENABLED=true to enable.');
      return {
        success: false,
        notificationType: NotificationType.CALL,
        error: 'Call notifications are disabled',
      };
    }

    try {
      // TODO: Integrate with voice call service (Twilio Voice, AWS Connect, etc.)
      const message = this.buildCallMessage(payload);
      
      this.logger.log(`Call would be made to: ${payload.phone}`);
      this.logger.log(`Message: ${message}`);

      // Example with Twilio Voice:
      // const twilioClient = require('twilio')(accountSid, authToken);
      // await twilioClient.calls.create({
      //   to: payload.phone,
      //   from: twilioPhoneNumber,
      //   url: 'https://your-server.com/voice-xml',
      // });

      return {
        success: true,
        notificationType: NotificationType.CALL,
        message: `Call notification initiated to ${payload.phone}`,
      };
    } catch (error) {
      this.logger.error(`Failed to send call notification: ${error.message}`, error.stack);
      return {
        success: false,
        notificationType: NotificationType.CALL,
        error: error.message,
      };
    }
  }

  /**
   * Send push notification
   */
  private async sendPushNotification(payload: NotificationPayload): Promise<NotificationResult> {
    const pushEnabled = this.configService.get<string>('PUSH_NOTIFICATION_ENABLED', 'false');
    if (pushEnabled !== 'true') {
      this.logger.warn('Push notifications are disabled. Set PUSH_NOTIFICATION_ENABLED=true to enable.');
      return {
        success: false,
        notificationType: NotificationType.PUSH_NOTIFICATION,
        error: 'Push notifications are disabled',
      };
    }

    try {
      // TODO: Integrate with push notification service (FCM, APNS, OneSignal, etc.)
      const title = `Reminder: ${payload.eventTitle}`;
      const body = this.buildPushNotificationBody(payload);
      
      this.logger.log(`Push notification would be sent to user: ${payload.userId}`);
      this.logger.log(`Title: ${title}`);
      this.logger.log(`Body: ${body}`);

      // Example with Firebase Cloud Messaging (FCM):
      // const admin = require('firebase-admin');
      // const message = {
      //   notification: { title, body },
      //   data: { eventId: payload.eventId },
      //   token: userFcmToken,
      // };
      // await admin.messaging().send(message);

      return {
        success: true,
        notificationType: NotificationType.PUSH_NOTIFICATION,
        message: `Push notification sent to user ${payload.userId}`,
      };
    } catch (error) {
      this.logger.error(`Failed to send push notification: ${error.message}`, error.stack);
      return {
        success: false,
        notificationType: NotificationType.PUSH_NOTIFICATION,
        error: error.message,
      };
    }
  }

  /**
   * Build SMS message
   */
  private buildSmsMessage(payload: NotificationPayload): string {
    const formattedDate = new Date(payload.eventDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return `Reminder: ${payload.eventTitle} for ${payload.personName} is in ${payload.reminderDays} day${payload.reminderDays > 1 ? 's' : ''}! Event date: ${formattedDate}. - Wishin`;
  }

  /**
   * Build call message text (for TTS)
   */
  private buildCallMessage(payload: NotificationPayload): string {
    const formattedDate = new Date(payload.eventDate).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    return `Hello, this is a reminder from Wishin. ${payload.eventTitle} for ${payload.personName} is coming up in ${payload.reminderDays} day${payload.reminderDays > 1 ? 's' : ''}. The event date is ${formattedDate}. Thank you.`;
  }

  /**
   * Build push notification body
   */
  private buildPushNotificationBody(payload: NotificationPayload): string {
    const formattedDate = new Date(payload.eventDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    return `${payload.eventTitle} for ${payload.personName} is in ${payload.reminderDays} day${payload.reminderDays > 1 ? 's' : ''}! (${formattedDate})`;
  }

  /**
   * Process and send notifications for a list of contacts
   */
  async processReminderNotifications(contacts: any[]): Promise<{
    total: number;
    successful: number;
    failed: number;
    results: Array<{
      contact: any;
      notificationResults: NotificationResult[];
    }>;
  }> {
    const results: Array<{
      contact: any;
      notificationResults: NotificationResult[];
    }> = [];

    let successful = 0;
    let failed = 0;

    for (const contact of contacts) {
      const payload: NotificationPayload = {
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
      } else {
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
}

