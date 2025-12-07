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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditService = void 0;
const common_1 = require("@nestjs/common");
const credit_repository_1 = require("../../database/repositories/credit.repository");
const user_repository_1 = require("../../database/repositories/user.repository");
let CreditService = class CreditService {
    constructor(creditRepository, userRepository) {
        this.creditRepository = creditRepository;
        this.userRepository = userRepository;
    }
    async getBalance(userId) {
        const balance = await this.creditRepository.getUserCreditBalance(userId);
        return { balance };
    }
    async getUserCredit(userId) {
        const userCredit = await this.creditRepository.findUserCreditByUserId(userId);
        if (!userCredit) {
            return {
                balance: 0,
                transactions: [],
            };
        }
        return {
            balance: Number(userCredit.balance),
            transactions: userCredit.transactions,
        };
    }
    async getTransactionHistory(userId, options) {
        return this.creditRepository.findCreditTransactionsByUserId(userId, options);
    }
    async getTransactionStatistics(user) {
        return this.creditRepository.getTransactionStatistics(user.id);
    }
    async getActivePackages() {
        return this.creditRepository.findActiveCreditPackages();
    }
    async getAllPackages(options) {
        return this.creditRepository.findAllCreditPackages(options);
    }
    async getPackageById(id) {
        const package_ = await this.creditRepository.findCreditPackageById(id);
        if (!package_) {
            throw new common_1.NotFoundException('Credit package not found');
        }
        return package_;
    }
    async createPackage(user, createDto) {
        const isAdmin = this.userRepository.isAdmin(user);
        if (!isAdmin) {
            throw new common_1.ForbiddenException('You are not authorized to create a credit package');
        }
        return this.creditRepository.createCreditPackage(createDto);
    }
    async updatePackage(user, id, updateDto) {
        const isAdmin = this.userRepository.isAdmin(user);
        if (!isAdmin) {
            throw new common_1.ForbiddenException('You are not authorized to create a credit package');
        }
        const package_ = await this.creditRepository.findCreditPackageById(id);
        if (!package_) {
            throw new common_1.NotFoundException('Credit package not found');
        }
        return this.creditRepository.updateCreditPackage(id, updateDto);
    }
    async deletePackage(user, id) {
        const isAdmin = this.userRepository.isAdmin(user);
        if (!isAdmin) {
            throw new common_1.ForbiddenException('You are not authorized to create a credit package');
        }
        const package_ = await this.creditRepository.findCreditPackageById(id);
        if (!package_) {
            throw new common_1.NotFoundException('Credit package not found');
        }
        await this.creditRepository.deleteCreditPackage(id);
    }
    async purchaseCredits(userId, purchaseDto) {
        const package_ = await this.creditRepository.findCreditPackageById(purchaseDto.packageId);
        if (!package_) {
            throw new common_1.NotFoundException('Credit package not found');
        }
        if (!package_.isActive) {
            throw new common_1.BadRequestException('Credit package is not active');
        }
        return this.creditRepository.processCreditPurchase(userId, purchaseDto.packageId, purchaseDto.paymentMethod, purchaseDto.paymentId);
    }
    async addBonus(userId, addBonusDto) {
        if (userId !== addBonusDto.userId) {
            throw new common_1.ForbiddenException('You can only add bonuses to your own account');
        }
        return this.creditRepository.addBonusCredits(addBonusDto.userId, addBonusDto.amount, addBonusDto.description);
    }
    async addBonusToUser(targetUserId, amount, description) {
        return this.creditRepository.addBonusCredits(targetUserId, amount, description);
    }
    async useCredits(userId, useCreditsDto) {
        const balance = await this.creditRepository.getUserCreditBalance(userId);
        if (balance < useCreditsDto.amount) {
            throw new common_1.BadRequestException('Insufficient credits');
        }
        return this.creditRepository.useCredits(userId, useCreditsDto.amount, useCreditsDto.description);
    }
};
exports.CreditService = CreditService;
exports.CreditService = CreditService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [credit_repository_1.CreditRepository,
        user_repository_1.UserRepository])
], CreditService);
//# sourceMappingURL=credit.service.js.map