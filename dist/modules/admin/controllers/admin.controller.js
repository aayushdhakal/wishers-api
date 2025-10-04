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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const admin_guard_1 = require("../auth/guards/admin.guard");
const admin_service_1 = require("../../services/admin/admin.service");
const export_service_1 = require("../../services/export/export.service");
let AdminController = class AdminController {
    constructor(adminService, exportService) {
        this.adminService = adminService;
        this.exportService = exportService;
    }
    async getReminderContacts(targetDate, eventType, reminderDays) {
        let parsedTargetDate;
        let parsedReminderDays;
        if (targetDate) {
            parsedTargetDate = new Date(targetDate);
            if (isNaN(parsedTargetDate.getTime())) {
                throw new common_1.BadRequestException('Invalid target date format. Use YYYY-MM-DD');
            }
        }
        if (reminderDays) {
            parsedReminderDays = parseInt(reminderDays, 10);
            if (isNaN(parsedReminderDays) || parsedReminderDays < 0) {
                throw new common_1.BadRequestException('Reminder days must be a positive number');
            }
        }
        return this.adminService.getUsersToContact(parsedTargetDate, eventType, parsedReminderDays);
    }
    async exportReminderContacts(format = 'excel', targetDate, eventType, reminderDays, res) {
        const supportedFormats = this.exportService.getSupportedFormats();
        if (!supportedFormats[format.toLowerCase()]) {
            throw new common_1.BadRequestException(`Unsupported format. Supported formats: ${Object.keys(supportedFormats).join(', ')}`);
        }
        let parsedTargetDate;
        let parsedReminderDays;
        if (targetDate) {
            parsedTargetDate = new Date(targetDate);
            if (isNaN(parsedTargetDate.getTime())) {
                throw new common_1.BadRequestException('Invalid target date format. Use YYYY-MM-DD');
            }
        }
        if (reminderDays) {
            parsedReminderDays = parseInt(reminderDays, 10);
            if (isNaN(parsedReminderDays) || parsedReminderDays < 0) {
                throw new common_1.BadRequestException('Reminder days must be a positive number');
            }
        }
        const contactsData = await this.adminService.getUsersToContact(parsedTargetDate, eventType, parsedReminderDays);
        const exportResult = await this.exportService.exportReminderContacts(contactsData.contacts, format, contactsData.targetDate);
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
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('reminder-contacts'),
    __param(0, (0, common_1.Query)('targetDate')),
    __param(1, (0, common_1.Query)('eventType')),
    __param(2, (0, common_1.Query)('reminderDays')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getReminderContacts", null);
__decorate([
    (0, common_1.Get)('reminder-contacts/export'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Query)('format')),
    __param(1, (0, common_1.Query)('targetDate')),
    __param(2, (0, common_1.Query)('eventType')),
    __param(3, (0, common_1.Query)('reminderDays')),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "exportReminderContacts", null);
__decorate([
    (0, common_1.Get)('export-formats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getSupportedExportFormats", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof admin_service_1.AdminService !== "undefined" && admin_service_1.AdminService) === "function" ? _a : Object, typeof (_b = typeof export_service_1.ExportService !== "undefined" && export_service_1.ExportService) === "function" ? _b : Object])
], AdminController);
//# sourceMappingURL=admin.controller.js.map