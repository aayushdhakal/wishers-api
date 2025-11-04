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
export declare class MailService {
    private readonly configService;
    private readonly logger;
    private readonly fromEmail;
    private readonly fromName;
    constructor(configService: ConfigService);
    sendMail(options: MailOptions): Promise<void>;
    sendWelcomeEmail(to: string, firstName: string): Promise<void>;
    sendPasswordResetEmail(to: string, resetToken: string, resetUrl: string): Promise<void>;
    sendEventReminderEmail(to: string, firstName: string, eventTitle: string, eventDate: Date, personName: string, reminderDays: number): Promise<void>;
    sendVerificationEmail(to: string, verificationToken: string, verificationUrl: string): Promise<void>;
}
