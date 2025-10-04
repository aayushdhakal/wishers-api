import { Response } from 'express';
import { AdminService } from '../../services/admin/admin.service';
import { ExportService } from '../../services/export/export.service';
import { ReminderContactListDto } from './dto';
export declare class AdminController {
    private readonly adminService;
    private readonly exportService;
    constructor(adminService: AdminService, exportService: ExportService);
    getReminderContacts(targetDate?: string, eventType?: string, reminderDays?: string): Promise<ReminderContactListDto>;
    exportReminderContacts(format: string, targetDate?: string, eventType?: string, reminderDays?: string, res: Response): Promise<void>;
    getSupportedExportFormats(): {
        formats: any;
        message: string;
    };
}
