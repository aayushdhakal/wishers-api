import { Response } from 'express';
import { EventRepository } from '../../../database/repositories/event.repository';
import { ExportService } from '../../../services/export/export.service';
export declare class ExportController {
    private readonly eventRepository;
    private readonly exportService;
    constructor(eventRepository: EventRepository, exportService: ExportService);
    getReminderContacts(targetDate?: string): Promise<{
        contacts: any[];
        total: number;
        targetDate: Date;
        summary: {
            totalContacts: number;
            byEventType: Record<string, number>;
            byReminderDays: Record<number, number>;
        };
    }>;
    exportReminderContacts(res: Response, targetDate?: string, format?: string): Promise<void>;
    getSupportedExportFormats(): {
        formats: Record<string, import("../../../services/export/export.service").ExportFormat>;
        message: string;
    };
    private groupByEventType;
    private groupByReminderDays;
}
