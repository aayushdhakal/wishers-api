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
exports.UserRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const bcrypt = require("bcryptjs");
let UserRepository = class UserRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createUser(data) {
        const hashedPassword = data.password
            ? await bcrypt.hash(data.password, 12)
            : null;
        return this.prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
                avatar: data.avatar,
            },
            include: {
                accounts: true,
            },
        });
    }
    async createOAuthUser(data) {
        return this.prisma.user.create({
            data: {
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                avatar: data.avatar,
                accounts: {
                    create: {
                        provider: data.provider,
                        providerAccountId: data.providerAccountId,
                        accessToken: data.accessToken,
                        refreshToken: data.refreshToken,
                        expiresAt: data.expiresAt,
                        tokenType: data.tokenType,
                        scope: data.scope,
                        idToken: data.idToken,
                    },
                },
            },
            include: {
                accounts: true,
            },
        });
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email },
            include: {
                accounts: true,
                userType: true,
            },
        });
    }
    async findById(id) {
        return this.prisma.user.findUnique({
            where: { id },
            include: {
                accounts: true,
            },
        });
    }
    async findByProvider(provider, providerAccountId) {
        const account = await this.prisma.account.findUnique({
            where: {
                provider_providerAccountId: {
                    provider,
                    providerAccountId,
                },
            },
            include: {
                user: {
                    include: {
                        accounts: true,
                    },
                },
            },
        });
        return account?.user || null;
    }
    isAdmin(user) {
        return user.userType?.name?.toLowerCase() === 'admin';
    }
    async setUserAsAdmin(userId) {
        const adminUserType = await this.prisma.userType.upsert({
            where: { name: 'admin' },
            update: {},
            create: {
                name: 'admin',
                description: 'Administrator user type',
                isActive: true,
            },
        });
        return this.prisma.user.update({
            where: { id: userId },
            data: { userTypeId: adminUserType.id },
            include: {
                accounts: true,
                userType: true,
            },
        });
    }
    async updateUser(id, data) {
        return this.prisma.user.update({
            where: { id },
            data,
            include: {
                accounts: true,
            },
        });
    }
    async updatePassword(id, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        return this.prisma.user.update({
            where: { id },
            data: { password: hashedPassword },
            include: {
                accounts: true,
            },
        });
    }
    async verifyPassword(user, password) {
        if (!user.password) {
            return false;
        }
        return bcrypt.compare(password, user.password);
    }
    async linkOAuthAccount(userId, provider, providerAccountId, accountData) {
        return this.prisma.account.create({
            data: {
                userId,
                provider,
                providerAccountId,
                accessToken: accountData.accessToken,
                refreshToken: accountData.refreshToken,
                expiresAt: accountData.expiresAt,
                tokenType: accountData.tokenType,
                scope: accountData.scope,
                idToken: accountData.idToken,
            },
        });
    }
    async updateOAuthTokens(provider, providerAccountId, tokens) {
        return this.prisma.account.update({
            where: {
                provider_providerAccountId: {
                    provider,
                    providerAccountId,
                },
            },
            data: tokens,
        });
    }
    async deleteUser(id) {
        return this.prisma.user.delete({
            where: { id },
            include: {
                accounts: true,
            },
        });
    }
    async findAll(skip, take, where) {
        return this.prisma.user.findMany({
            skip,
            take,
            where,
            include: {
                accounts: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async count(where) {
        return this.prisma.user.count({ where });
    }
    async existsByEmail(email) {
        const user = await this.prisma.user.findUnique({
            where: { email },
            select: { id: true },
        });
        return !!user;
    }
    async toggleUserStatus(id, isActive) {
        return this.prisma.user.update({
            where: { id },
            data: { isActive },
            include: {
                accounts: true,
            },
        });
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserRepository);
//# sourceMappingURL=user.repository.js.map