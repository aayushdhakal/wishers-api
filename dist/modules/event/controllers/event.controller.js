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
exports.EventController = void 0;
const common_1 = require("@nestjs/common");
const event_service_1 = require("../../../services/event/event.service");
const dto_1 = require("../dto");
const guards_1 = require("../../auth/guards");
const decorators_1 = require("../../auth/decorators");
let EventController = class EventController {
    constructor(eventService) {
        this.eventService = eventService;
    }
    async createEvent(user, createEventDto) {
        return this.eventService.createEvent(user.id, createEventDto);
    }
    async getUserEvents(user, page, limit, eventType, startDate, endDate, isActive) {
        if (limit < 1 || limit > 100) {
            throw new common_1.BadRequestException('Limit must be between 1 and 100');
        }
        if (page < 1) {
            throw new common_1.BadRequestException('Page must be a positive number');
        }
        return this.eventService.getUserEvents(user.id, {
            page,
            limit,
            eventType,
            startDate,
            endDate,
            isActive,
        });
    }
    async getUpcomingEvents(user, limit) {
        if (limit < 1 || limit > 100) {
            throw new common_1.BadRequestException('Limit must be between 1 and 100');
        }
        return this.eventService.getUpcomingEvents(user.id, limit);
    }
    async getUserEventStats(user) {
        return this.eventService.getUserEventStatistics(user.id);
    }
    async getMyCardsDetails(user) {
        return this.eventService.getUserEventStatistics(user.id);
    }
    async getEventsByDateRange(user, startDate, endDate) {
        return this.eventService.getEventsByDateRange(user.id, startDate, endDate);
    }
    async getEventsByType(user, eventType, page, limit) {
        if (limit < 1 || limit > 100) {
            throw new common_1.BadRequestException('Limit must be between 1 and 100');
        }
        if (page < 1) {
            throw new common_1.BadRequestException('Page must be a positive number');
        }
        return this.eventService.getEventsByType(user.id, eventType, { page, limit });
    }
    async getEventById(user, eventId) {
        return this.eventService.getEventById(user.id, eventId);
    }
    async updateEvent(user, eventId, updateEventDto) {
        return this.eventService.updateEvent(user.id, eventId, updateEventDto);
    }
    async updateEventStatus(user, eventId, updateEventDto) {
        return this.eventService.updateEventStatus(user.id, eventId, updateEventDto);
    }
    async deleteEvent(user, eventId) {
        return this.eventService.deleteEvent(user.id, eventId);
    }
};
exports.EventController = EventController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.CreateEventDto]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "createEvent", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __param(3, (0, common_1.Query)('eventType')),
    __param(4, (0, common_1.Query)('startDate')),
    __param(5, (0, common_1.Query)('endDate')),
    __param(6, (0, common_1.Query)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, String, String, String, Boolean]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "getUserEvents", null);
__decorate([
    (0, common_1.Get)('upcoming'),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "getUpcomingEvents", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "getUserEventStats", null);
__decorate([
    (0, common_1.Get)('my-cards'),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "getMyCardsDetails", null);
__decorate([
    (0, common_1.Get)('date-range'),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "getEventsByDateRange", null);
__decorate([
    (0, common_1.Get)('type/:eventType'),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('eventType')),
    __param(2, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(3, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number, Number]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "getEventsByType", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "getEventById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto_1.UpdateEventDto]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "updateEvent", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto_1.UpdateEventStatusDto]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "updateEventStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "deleteEvent", null);
exports.EventController = EventController = __decorate([
    (0, common_1.Controller)('events'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    __metadata("design:paramtypes", [event_service_1.EventService])
], EventController);
//# sourceMappingURL=event.controller.js.map