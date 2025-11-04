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
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let MailService = MailService_1 = class MailService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(MailService_1.name);
        this.fromEmail = this.configService.get('MAIL_FROM_EMAIL') || 'noreply@wishin.com';
        this.fromName = this.configService.get('APP_NAME') || 'Wishin';
    }
    async sendMail(options) {
        try {
            const mailEnabled = this.configService.get('MAIL_ENABLED', 'false');
            if (mailEnabled !== 'true') {
                this.logger.warn('Email sending is disabled. Set MAIL_ENABLED=true to enable.');
                return;
            }
            this.logger.log(`Email would be sent to: ${Array.isArray(options.to) ? options.to.join(', ') : options.to}`);
            this.logger.log(`Subject: ${options.subject}`);
        }
        catch (error) {
            this.logger.error(`Failed to send email: ${error.message}`, error.stack);
            throw error;
        }
    }
    async sendWelcomeEmail(to, firstName) {
        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Welcome to Wishin, ${firstName}!</h1>
        <p>Thank you for joining Wishin. We're excited to help you manage your special events and reminders.</p>
        <p>If you have any questions, feel free to reach out to us.</p>
        <p>Best regards,<br>The Wishin Team</p>
      </div>
    `;
        await this.sendMail({
            to,
            subject: 'Welcome to Wishin!',
            html,
        });
    }
    async sendPasswordResetEmail(to, resetToken, resetUrl) {
        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Password Reset Request</h1>
        <p>You requested to reset your password. Click the link below to reset it:</p>
        <p><a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
        <p>Or copy and paste this link into your browser:</p>
        <p>${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `;
        await this.sendMail({
            to,
            subject: 'Reset Your Password - Wishin',
            html,
        });
    }
    async sendEventReminderEmail(to, firstName, eventTitle, eventDate, personName, reminderDays) {
        const formattedDate = new Date(eventDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Reminder: ${eventTitle}</h1>
        <p>Hi ${firstName},</p>
        <p>This is a reminder that <strong>${eventTitle}</strong> for ${personName} is coming up in ${reminderDays} day${reminderDays > 1 ? 's' : ''}!</p>
        <p><strong>Event Date:</strong> ${formattedDate}</p>
        <p>Don't forget to prepare and make it special!</p>
        <p>Best regards,<br>The Wishin Team</p>
      </div>
    `;
        await this.sendMail({
            to,
            subject: `Reminder: ${eventTitle} in ${reminderDays} day${reminderDays > 1 ? 's' : ''}`,
            html,
        });
    }
    async sendVerificationEmail(to, verificationToken, verificationUrl) {
        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Verify Your Email Address</h1>
        <p>Thank you for signing up! Please verify your email address by clicking the link below:</p>
        <p><a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
        <p>Or copy and paste this link into your browser:</p>
        <p>${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account, please ignore this email.</p>
      </div>
    `;
        await this.sendMail({
            to,
            subject: 'Verify Your Email - Wishin',
            html,
        });
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map