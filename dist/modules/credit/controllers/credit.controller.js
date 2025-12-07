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
exports.CreditController = void 0;
const common_1 = require("@nestjs/common");
const credit_service_1 = require("../../../services/credit/credit.service");
const dto_1 = require("../dto");
const guards_1 = require("../../auth/guards");
const decorators_1 = require("../../auth/decorators");
const client_1 = require("@prisma/client");
let CreditController = class CreditController {
    constructor(creditService) {
        this.creditService = creditService;
    }
    async getBalance(user) {
        return this.creditService.getBalance(user.id);
    }
    async getAccount(user) {
        return this.creditService.getUserCredit(user.id);
    }
    async getTransactionHistory(user, type, page, limit) {
        const skip = (page - 1) * limit;
        return this.creditService.getTransactionHistory(user.id, {
            type,
            skip,
            take: limit,
        });
    }
    async getStatistics(user) {
        return this.creditService.getTransactionStatistics(user);
    }
    async getActivePackages() {
        return this.creditService.getActivePackages();
    }
    async getPackageById(id) {
        return this.creditService.getPackageById(id);
    }
    async createPackage(user, createDto) {
        return this.creditService.createPackage(user, createDto);
    }
    async updatePackage(user, id, updateDto) {
        return this.creditService.updatePackage(user, id, updateDto);
    }
    async deletePackage(user, id) {
        await this.creditService.deletePackage(user, id);
    }
    async purchaseCredits(user, purchaseDto) {
        return this.creditService.purchaseCredits(user.id, purchaseDto);
    }
    async addBonus(user, addBonusDto) {
        if (addBonusDto.userId !== user.id) {
            addBonusDto.userId = user.id;
        }
        return this.creditService.addBonus(user.id, addBonusDto);
    }
    async useCredits(user, useCreditsDto) {
        return this.creditService.useCredits(user.id, useCreditsDto);
    }
};
exports.CreditController = CreditController;
__decorate([
    (0, common_1.Get)('balance'),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CreditController.prototype, "getBalance", null);
__decorate([
    (0, common_1.Get)('account'),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CreditController.prototype, "getAccount", null);
__decorate([
    (0, common_1.Get)('transactions'),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(3, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(20), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number, Number]),
    __metadata("design:returntype", Promise)
], CreditController.prototype, "getTransactionHistory", null);
__decorate([
    (0, common_1.Get)('statistics'),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CreditController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)('packages'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CreditController.prototype, "getActivePackages", null);
__decorate([
    (0, common_1.Get)('packages/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CreditController.prototype, "getPackageById", null);
__decorate([
    (0, common_1.Post)('packages'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.CreateCreditPackageDto]),
    __metadata("design:returntype", Promise)
], CreditController.prototype, "createPackage", null);
__decorate([
    (0, common_1.Put)('packages/:id'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto_1.UpdateCreditPackageDto]),
    __metadata("design:returntype", Promise)
], CreditController.prototype, "updatePackage", null);
__decorate([
    (0, common_1.Delete)('packages/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CreditController.prototype, "deletePackage", null);
__decorate([
    (0, common_1.Post)('purchase'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.PurchaseCreditsDto]),
    __metadata("design:returntype", Promise)
], CreditController.prototype, "purchaseCredits", null);
__decorate([
    (0, common_1.Post)('bonus'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.AddBonusDto]),
    __metadata("design:returntype", Promise)
], CreditController.prototype, "addBonus", null);
__decorate([
    (0, common_1.Post)('use'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.UseCreditsDto]),
    __metadata("design:returntype", Promise)
], CreditController.prototype, "useCredits", null);
exports.CreditController = CreditController = __decorate([
    (0, common_1.Controller)('credits'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    __metadata("design:paramtypes", [credit_service_1.CreditService])
], CreditController);
//# sourceMappingURL=credit.controller.js.map