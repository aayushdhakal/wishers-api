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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const admin_guard_1 = require("../../auth/guards/admin.guard");
const event_repository_1 = require("../../../database/repositories/event.repository");
const export_service_1 = require("../../../services/export/export.service");
let ExportController = class ExportController {
    constructor(eventRepository, exportService) {
        this.eventRepository = eventRepository;
        this.exportService = exportService;
    }
    async getReminderContacts(targetDate) {
        let parsedTargetDate;
        if (targetDate) {
            parsedTargetDate = new Date(targetDate);
            if (isNaN(parsedTargetDate.getTime())) {
                throw new common_1.BadRequestException('Invalid target date format. Use YYYY-MM-DD');
            }
        }
        else {
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
    async exportReminderContacts(res, targetDate, format) {
        const exportFormat = format || 'excel';
        const supportedFormats = this.exportService.getSupportedFormats();
        if (!supportedFormats[exportFormat.toLowerCase()]) {
            throw new common_1.BadRequestException(`Unsupported format. Supported formats: ${Object.keys(supportedFormats).join(', ')}`);
        }
        let parsedTargetDate;
        if (targetDate) {
            parsedTargetDate = new Date(targetDate);
            if (isNaN(parsedTargetDate.getTime())) {
                throw new common_1.BadRequestException('Invalid target date format. Use YYYY-MM-DD');
            }
        }
        else {
            parsedTargetDate = new Date();
        }
        const contacts = await this.eventRepository.findUsersToContact(parsedTargetDate);
        const exportResult = await this.exportService.exportReminderContacts(contacts, exportFormat, parsedTargetDate);
        res.setHeader('Content-Type', exportResult.mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="${exportResult.filename}"`);
        res.setHeader('Content-Length', exportResult.buffer.length);
        res.send(exportResult.buffer);
    }
    getSupportedExportFormats() {
        return {
            formats: this.exportService.getSupportedFormats(),
            message: 'Supported export formats',
        };
    }
    groupByEventType(contacts) {
        const grouped = {};
        contacts.forEach(contact => {
            grouped[contact.eventType] = (grouped[contact.eventType] || 0) + 1;
        });
        return grouped;
    }
    groupByReminderDays(contacts) {
        const grouped = {};
        contacts.forEach(contact => {
            grouped[contact.reminderDays] = (grouped[contact.reminderDays] || 0) + 1;
        });
        return grouped;
    }
};
exports.ExportController = ExportController;
__decorate([
    (0, common_1.Get)('reminder-contacts'),
    __param(0, (0, common_1.Query)('targetDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExportController.prototype, "getReminderContacts", null);
__decorate([
    (0, common_1.Get)('reminder-contacts/download'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)('targetDate')),
    __param(2, (0, common_1.Query)('format')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], ExportController.prototype, "exportReminderContacts", null);
__decorate([
    (0, common_1.Get)('formats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ExportController.prototype, "getSupportedExportFormats", null);
exports.ExportController = ExportController = __decorate([
    (0, common_1.Controller)('export'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __metadata("design:paramtypes", [event_repository_1.EventRepository,
        export_service_1.ExportService])
], ExportController);
//# sourceMappingURL=export.controller.js.map