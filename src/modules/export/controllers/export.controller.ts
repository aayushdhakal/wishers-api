import {
  Controller,
  Get,
  Query,
  UseGuards,
  BadRequestException,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { EventRepository } from '../../../database/repositories/event.repository';
import { ExportService } from '../../../services/export/export.service';

@Controller('export')
@UseGuards(JwtAuthGuard, AdminGuard)
export class ExportController {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly exportService: ExportService,
  ) {}

  /**
   * Get users to contact based on reminder dates (Admin only)
   * Default: today's reminders
   */
  @Get('reminder-contacts')
  async getReminderContacts(
    @Query('targetDate') targetDate?: string,
  ) {
    let parsedTargetDate: Date;

    // Parse target date or use today as default
    if (targetDate) {
      parsedTargetDate = new Date(targetDate);
      if (isNaN(parsedTargetDate.getTime())) {
        throw new BadRequestException('Invalid target date format. Use YYYY-MM-DD');
      }
    } else {
      parsedTargetDate = new Date();
    }

    const contacts = await this.eventRepository.findUsersToContact(parsedTargetDate);

    return {
      contacts,
      total: contacts.length,
      targetDate: parsedTargetDate,
      summary: {
        totalContacts: contacts.length,
        byEventType: this.groupByEventType(contacts),
        byReminderDays: this.groupByReminderDays(contacts),
      },
    };
  }

  /**
   * Export reminder contacts in specified format (Admin only)
   */
  @Get('reminder-contacts/download')
  @HttpCode(HttpStatus.OK)
  async exportReminderContacts(
    @Res() res: Response,
    @Query('targetDate') targetDate?: string,
    @Query('format') format?: string,
  ): Promise<void> {
    // Set default format if not provided
    const exportFormat = format || 'excel';
    // Validate format
    const supportedFormats = this.exportService.getSupportedFormats();
    if (!supportedFormats[exportFormat.toLowerCase()]) {
      throw new BadRequestException(`Unsupported format. Supported formats: ${Object.keys(supportedFormats).join(', ')}`);
    }

    let parsedTargetDate: Date;

    // Parse target date or use today as default
    if (targetDate) {
      parsedTargetDate = new Date(targetDate);
      if (isNaN(parsedTargetDate.getTime())) {
        throw new BadRequestException('Invalid target date format. Use YYYY-MM-DD');
      }
    } else {
      parsedTargetDate = new Date();
    }

    // Get contacts data
    const contacts = await this.eventRepository.findUsersToContact(parsedTargetDate);

    // Export data
    const exportResult = await this.exportService.exportReminderContacts(
      contacts,
      exportFormat,
      parsedTargetDate,
    );

    // Set response headers
    res.setHeader('Content-Type', exportResult.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${exportResult.filename}"`);
    res.setHeader('Content-Length', exportResult.buffer.length);

    // Send file
    res.send(exportResult.buffer);
  }

  /**
   * Get supported export formats (Admin only)
   */
  @Get('formats')
  getSupportedExportFormats() {
    return {
      formats: this.exportService.getSupportedFormats(),
      message: 'Supported export formats',
    };
  }

  /**
   * Group contacts by event type
   */
  private groupByEventType(contacts: any[]): Record<string, number> {
    const grouped: Record<string, number> = {};
    contacts.forEach(contact => {
      grouped[contact.eventType] = (grouped[contact.eventType] || 0) + 1;
    });
    return grouped;
  }

  /**
   * Group contacts by reminder days
   */
  private groupByReminderDays(contacts: any[]): Record<number, number> {
    const grouped: Record<number, number> = {};
    contacts.forEach(contact => {
      grouped[contact.reminderDays] = (grouped[contact.reminderDays] || 0) + 1;
    });
    return grouped;
  }
}
