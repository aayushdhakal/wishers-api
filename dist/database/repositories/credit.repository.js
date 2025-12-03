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
exports.CreditRepository = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma.service");
let CreditRepository = class CreditRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createUserCredit(data) {
        return this.prisma.userCredit.create({
            data: {
                userId: data.userId,
                balance: data.balance || 0,
            },
        });
    }
    async getOrCreateUserCredit(userId) {
        return this.prisma.userCredit.upsert({
            where: { userId },
            update: {},
            create: {
                userId,
                balance: 0,
            },
        });
    }
    async findUserCreditByUserId(userId) {
        return this.prisma.userCredit.findUnique({
            where: { userId },
            include: {
                transactions: {
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
            },
        });
    }
    async findUserCreditById(id) {
        return this.prisma.userCredit.findUnique({
            where: { id },
            include: {
                transactions: {
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
    }
    async updateUserCredit(userId, data) {
        return this.prisma.userCredit.update({
            where: { userId },
            data: {
                balance: data.balance,
            },
        });
    }
    async getUserCreditBalance(userId) {
        const userCredit = await this.getOrCreateUserCredit(userId);
        return Number(userCredit.balance);
    }
    async deleteUserCredit(userId) {
        return this.prisma.userCredit.delete({
            where: { userId },
        });
    }
    async findAllUserCredits(options) {
        return this.prisma.userCredit.findMany({
            skip: options?.skip,
            take: options?.take,
            orderBy: options?.orderBy || { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
    }
    async createCreditTransaction(data) {
        return this.prisma.creditTransaction.create({
            data: {
                userId: data.userId,
                userCreditId: data.userCreditId,
                type: data.type,
                status: data.status || client_1.CreditTransactionStatus.PENDING,
                amount: data.amount,
                balanceBefore: data.balanceBefore,
                balanceAfter: data.balanceAfter,
                description: data.description,
                paymentMethod: data.paymentMethod,
                paymentId: data.paymentId,
                metadata: data.metadata || {},
            },
        });
    }
    async findCreditTransactionById(id) {
        return this.prisma.creditTransaction.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                userCredit: true,
            },
        });
    }
    async findCreditTransactionsByUserId(userId, options) {
        return this.prisma.creditTransaction.findMany({
            where: {
                userId,
                ...(options?.type && { type: options.type }),
                ...(options?.status && { status: options.status }),
            },
            skip: options?.skip,
            take: options?.take,
            orderBy: options?.orderBy || { createdAt: 'desc' },
        });
    }
    async findCreditTransactionsByUserCreditId(userCreditId, options) {
        return this.prisma.creditTransaction.findMany({
            where: {
                userCreditId,
                ...(options?.type && { type: options.type }),
                ...(options?.status && { status: options.status }),
            },
            skip: options?.skip,
            take: options?.take,
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateCreditTransaction(id, data) {
        return this.prisma.creditTransaction.update({
            where: { id },
            data: {
                status: data.status,
                description: data.description,
                metadata: data.metadata,
            },
        });
    }
    async findAllCreditTransactions(options) {
        return this.prisma.creditTransaction.findMany({
            where: {
                ...(options?.type && { type: options.type }),
                ...(options?.status && { status: options.status }),
                ...(options?.userId && { userId: options.userId }),
            },
            skip: options?.skip,
            take: options?.take,
            orderBy: options?.orderBy || { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                userCredit: true,
            },
        });
    }
    async deleteCreditTransaction(id) {
        return this.prisma.creditTransaction.delete({
            where: { id },
        });
    }
    async getTransactionStatistics(userId) {
        const transactions = await this.prisma.creditTransaction.findMany({
            where: {
                userId,
                status: client_1.CreditTransactionStatus.COMPLETED,
            },
        });
        const stats = {
            totalPurchases: 0,
            totalUsage: 0,
            totalBonuses: 0,
            totalRefunds: 0,
            totalTransactions: transactions.length,
        };
        transactions.forEach((transaction) => {
            const amount = Number(transaction.amount);
            switch (transaction.type) {
                case client_1.CreditTransactionType.PURCHASE:
                    stats.totalPurchases += amount;
                    break;
                case client_1.CreditTransactionType.USAGE:
                    stats.totalUsage += Math.abs(amount);
                    break;
                case client_1.CreditTransactionType.BONUS:
                    stats.totalBonuses += amount;
                    break;
                case client_1.CreditTransactionType.REFUND:
                    stats.totalRefunds += amount;
                    break;
            }
        });
        return stats;
    }
    async createCreditPackage(data) {
        return this.prisma.creditPackage.create({
            data: {
                name: data.name,
                description: data.description,
                credits: data.credits,
                price: data.price,
                currency: data.currency || 'USD',
                bonusCredits: data.bonusCredits || 0,
                isActive: data.isActive !== undefined ? data.isActive : true,
                displayOrder: data.displayOrder || 0,
            },
        });
    }
    async findCreditPackageById(id) {
        return this.prisma.creditPackage.findUnique({
            where: { id },
        });
    }
    async findActiveCreditPackages() {
        return this.prisma.creditPackage.findMany({
            where: { isActive: true },
            orderBy: { displayOrder: 'asc' },
        });
    }
    async findAllCreditPackages(options) {
        return this.prisma.creditPackage.findMany({
            where: {
                ...(options?.isActive !== undefined && { isActive: options.isActive }),
            },
            skip: options?.skip,
            take: options?.take,
            orderBy: options?.orderBy || { displayOrder: 'asc' },
        });
    }
    async updateCreditPackage(id, data) {
        return this.prisma.creditPackage.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
                credits: data.credits,
                price: data.price,
                currency: data.currency,
                bonusCredits: data.bonusCredits,
                isActive: data.isActive,
                displayOrder: data.displayOrder,
            },
        });
    }
    async deleteCreditPackage(id) {
        return this.prisma.creditPackage.delete({
            where: { id },
        });
    }
    async addBonusCredits(userId, amount, description, metadata) {
        return this.prisma.$transaction(async (tx) => {
            const userCredit = await tx.userCredit.upsert({
                where: { userId },
                update: {},
                create: {
                    userId,
                    balance: 0,
                },
            });
            const balanceBefore = Number(userCredit.balance);
            const balanceAfter = balanceBefore + amount;
            const transaction = await tx.creditTransaction.create({
                data: {
                    userId,
                    userCreditId: userCredit.id,
                    type: client_1.CreditTransactionType.BONUS,
                    status: client_1.CreditTransactionStatus.COMPLETED,
                    amount: amount,
                    balanceBefore: balanceBefore,
                    balanceAfter: balanceAfter,
                    description: description || 'Bonus credits added',
                    metadata: metadata || {},
                },
            });
            await tx.userCredit.update({
                where: { id: userCredit.id },
                data: {
                    balance: balanceAfter,
                },
            });
            return transaction;
        });
    }
    async processCreditPurchase(userId, packageId, paymentMethod, paymentId, metadata) {
        return this.prisma.$transaction(async (tx) => {
            const creditPackage = await tx.creditPackage.findUnique({
                where: { id: packageId },
            });
            if (!creditPackage) {
                throw new Error('Credit package not found');
            }
            if (!creditPackage.isActive) {
                throw new Error('Credit package is not active');
            }
            const userCredit = await tx.userCredit.upsert({
                where: { userId },
                update: {},
                create: {
                    userId,
                    balance: 0,
                },
            });
            const totalCredits = Number(creditPackage.credits) + Number(creditPackage.bonusCredits);
            const balanceBefore = Number(userCredit.balance);
            const balanceAfter = balanceBefore + totalCredits;
            const transaction = await tx.creditTransaction.create({
                data: {
                    userId,
                    userCreditId: userCredit.id,
                    type: client_1.CreditTransactionType.PURCHASE,
                    status: client_1.CreditTransactionStatus.COMPLETED,
                    amount: totalCredits,
                    balanceBefore: balanceBefore,
                    balanceAfter: balanceAfter,
                    description: `Purchased ${creditPackage.name}`,
                    paymentMethod: paymentMethod,
                    paymentId: paymentId,
                    metadata: {
                        packageId: packageId,
                        packageName: creditPackage.name,
                        packageCredits: Number(creditPackage.credits),
                        bonusCredits: Number(creditPackage.bonusCredits),
                        price: Number(creditPackage.price),
                        currency: creditPackage.currency,
                        ...metadata,
                    },
                },
            });
            await tx.userCredit.update({
                where: { id: userCredit.id },
                data: {
                    balance: balanceAfter,
                },
            });
            return transaction;
        });
    }
    async useCredits(userId, amount, description, metadata) {
        return this.prisma.$transaction(async (tx) => {
            const userCredit = await tx.userCredit.findUnique({
                where: { userId },
            });
            if (!userCredit) {
                throw new Error('User credit account not found');
            }
            const currentBalance = Number(userCredit.balance);
            if (currentBalance < amount) {
                throw new Error('Insufficient credits');
            }
            const balanceBefore = currentBalance;
            const balanceAfter = balanceBefore - amount;
            const transaction = await tx.creditTransaction.create({
                data: {
                    userId,
                    userCreditId: userCredit.id,
                    type: client_1.CreditTransactionType.USAGE,
                    status: client_1.CreditTransactionStatus.COMPLETED,
                    amount: -amount,
                    balanceBefore: balanceBefore,
                    balanceAfter: balanceAfter,
                    description: description || 'Credits used',
                    metadata: metadata || {},
                },
            });
            await tx.userCredit.update({
                where: { id: userCredit.id },
                data: {
                    balance: balanceAfter,
                },
            });
            return transaction;
        });
    }
};
exports.CreditRepository = CreditRepository;
exports.CreditRepository = CreditRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CreditRepository);
//# sourceMappingURL=credit.repository.js.map