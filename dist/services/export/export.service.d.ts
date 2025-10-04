export interface ExportFormat {
    name: string;
    extension: string;
    mimeType: string;
}
export interface ExportResult {
    buffer: Buffer;
    filename: string;
    mimeType: string;
}
export declare class ExportService {
    private readonly supportedFormats;
    getSupportedFormats(): Record<string, ExportFormat>;
    exportReminderContacts(contacts: any[], format: string, targetDate: Date): Promise<ExportResult>;
    private exportToExcel;
    private exportToCSV;
}
