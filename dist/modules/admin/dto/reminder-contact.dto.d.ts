export declare class ReminderContactDto {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    eventId: string;
    eventTitle: string;
    eventDate: Date;
    eventType: string;
    personName: string;
    reminderDays: number;
    notificationTypes: string[];
    targetDate: Date;
}
export declare class ReminderContactListDto {
    contacts: ReminderContactDto[];
    total: number;
    targetDate: Date;
    summary: {
        totalContacts: number;
        byEventType: Record<string, number>;
        byReminderDays: Record<number, number>;
    };
}
export declare class ExportRequestDto {
    format: 'excel' | 'csv' | 'pdf';
    targetDate?: string;
    eventType?: string;
    reminderDays?: number;
}
