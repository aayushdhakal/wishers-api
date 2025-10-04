"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportService = void 0;
const common_1 = require("@nestjs/common");
const XLSX = require("xlsx");
let ExportService = class ExportService {
    constructor() {
        this.supportedFormats = {
            excel: {
                name: 'Microsoft Excel',
                extension: 'xlsx',
                mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            },
            csv: {
                name: 'Comma Separated Values',
                extension: 'csv',
                mimeType: 'text/csv',
            },
            pdf: {
                name: 'Portable Document Format',
                extension: 'pdf',
                mimeType: 'application/pdf',
            },
        };
    }
    getSupportedFormats() {
        return this.supportedFormats;
    }
    async exportReminderContacts(contacts, format, targetDate) {
        const formatConfig = this.supportedFormats[format.toLowerCase()];
        if (!formatConfig) {
            throw new Error(`Unsupported export format: ${format}`);
        }
        const dateStr = targetDate.toISOString().split('T')[0];
        const filename = `reminder-contacts-${dateStr}.${formatConfig.extension}`;
        switch (format.toLowerCase()) {
            case 'excel':
                return this.exportToExcel(contacts, filename, formatConfig.mimeType);
            case 'csv':
                return this.exportToCSV(contacts, filename, formatConfig.mimeType);
            case 'pdf':
                throw new Error('PDF export is not implemented yet. Please use Excel or CSV format.');
            default:
                throw new Error(`Export format ${format} is not implemented yet`);
        }
    }
    async exportToExcel(contacts, filename, mimeType) {
        const worksheetData = contacts.map(contact => ({
            'User ID': contact.userId,
            'Email': contact.email,
            'First Name': contact.firstName || '',
            'Last Name': contact.lastName || '',
            'Phone': contact.phone || '',
            'Event ID': contact.eventId,
            'Event Title': contact.eventTitle,
            'Event Date': contact.eventDate.toISOString().split('T')[0],
            'Event Type': contact.eventType,
            'Person Name': contact.personName,
            'Reminder Days': contact.reminderDays,
            'Notification Types': contact.notificationTypes.join(', '),
            'Target Date': contact.targetDate.toISOString().split('T')[0],
        }));
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Reminder Contacts');
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
        return {
            buffer: Buffer.from(buffer),
            filename,
            mimeType,
        };
    }
    async exportToCSV(contacts, filename, mimeType) {
        const headers = [
            'User ID',
            'Email',
            'First Name',
            'Last Name',
            'Phone',
            'Event ID',
            'Event Title',
            'Event Date',
            'Event Type',
            'Person Name',
            'Reminder Days',
            'Notification Types',
            'Target Date',
        ];
        const rows = contacts.map(contact => [
            contact.userId,
            contact.email,
            contact.firstName || '',
            contact.lastName || '',
            contact.phone || '',
            contact.eventId,
            contact.eventTitle,
            contact.eventDate.toISOString().split('T')[0],
            contact.eventType,
            contact.personName,
            contact.reminderDays.toString(),
            contact.notificationTypes.join('; '),
            contact.targetDate.toISOString().split('T')[0],
        ]);
        const csvContent = [headers, ...rows]
            .map(row => row.map(cell => `"${cell.toString().replace(/"/g, '""')}"`).join(','))
            .join('\n');
        return {
            buffer: Buffer.from(csvContent, 'utf-8'),
            filename,
            mimeType,
        };
    }
};
exports.ExportService = ExportService;
exports.ExportService = ExportService = __decorate([
    (0, common_1.Injectable)()
], ExportService);
//# sourceMappingURL=export.service.js.map