import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';

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

@Injectable()
export class ExportService {
  private readonly supportedFormats: Record<string, ExportFormat> = {
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

  /**
   * Get supported export formats
   */
  getSupportedFormats(): Record<string, ExportFormat> {
    return this.supportedFormats;
  }

  /**
   * Export reminder contacts to specified format
   */
  async exportReminderContacts(
    contacts: any[],
    format: string,
    targetDate: Date
  ): Promise<ExportResult> {
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

  /**
   * Export to Excel format
   */
  private async exportToExcel(
    contacts: any[],
    filename: string,
    mimeType: string
  ): Promise<ExportResult> {
    // Prepare data for Excel
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

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reminder Contacts');

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return {
      buffer: Buffer.from(buffer),
      filename,
      mimeType,
    };
  }

  /**
   * Export to CSV format
   */
  private async exportToCSV(
    contacts: any[],
    filename: string,
    mimeType: string
  ): Promise<ExportResult> {
    // Create CSV header
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

    // Create CSV rows
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

    // Combine headers and rows
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell.toString().replace(/"/g, '""')}"`).join(','))
      .join('\n');

    return {
      buffer: Buffer.from(csvContent, 'utf-8'),
      filename,
      mimeType,
    };
  }
}
