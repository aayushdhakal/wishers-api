import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface MailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    content?: string | Buffer;
    path?: string;
    contentType?: string;
  }>;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly fromEmail: string;
  private readonly fromName: string;

  constructor(private readonly configService: ConfigService) {
    this.fromEmail = this.configService.get<string>('MAIL_FROM_EMAIL') || 'noreply@wishin.com';
    this.fromName = this.configService.get<string>('APP_NAME') || 'Wishin';
  }

  /**
   * Send an email
   */
  async sendMail(options: MailOptions): Promise<void> {
    try {
      // Check if email is enabled
      const mailEnabled = this.configService.get<string>('MAIL_ENABLED', 'false');
      if (mailEnabled !== 'true') {
        this.logger.warn('Email sending is disabled. Set MAIL_ENABLED=true to enable.');
        return;
      }

      // For now, we'll log the email (you can integrate with nodemailer, sendgrid, etc.)
      this.logger.log(`Email would be sent to: ${Array.isArray(options.to) ? options.to.join(', ') : options.to}`);
      this.logger.log(`Subject: ${options.subject}`);
      
      // TODO: Integrate with actual email service (nodemailer, sendgrid, AWS SES, etc.)
      // Example with nodemailer:
      // const transporter = nodemailer.createTransport({...});
      // await transporter.sendMail({...});
      
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Send a welcome email
   */
  async sendWelcomeEmail(to: string, firstName: string): Promise<void> {
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

  /**
   * Send a password reset email
   */
  async sendPasswordResetEmail(to: string, resetToken: string, resetUrl: string): Promise<void> {
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

  /**
   * Send an event reminder email
   */
  async sendEventReminderEmail(
    to: string,
    firstName: string,
    eventTitle: string,
    eventDate: Date,
    personName: string,
    reminderDays: number,
  ): Promise<void> {
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

  /**
   * Send a verification email
   */
  async sendVerificationEmail(to: string, verificationToken: string, verificationUrl: string): Promise<void> {
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
}

