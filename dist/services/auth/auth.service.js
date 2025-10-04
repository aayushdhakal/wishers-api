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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_repository_1 = require("../../database/repositories/user.repository");
let AuthService = class AuthService {
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const { email, password, firstName, lastName, avatar } = registerDto;
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        const user = await this.userRepository.createUser({
            email,
            password,
            firstName,
            lastName,
            avatar,
        });
        const tokens = await this.generateTokens(user);
        return {
            ...tokens,
            user: this.excludePassword(user),
        };
    }
    async validateUser(email, password) {
        const user = await this.userRepository.findByEmail(email);
        if (!user || !user.isActive) {
            return null;
        }
        const isPasswordValid = await this.userRepository.verifyPassword(user, password);
        if (!isPasswordValid) {
            return null;
        }
        return user;
    }
    async login(user) {
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Account is inactive');
        }
        const tokens = await this.generateTokens(user);
        return {
            ...tokens,
            user: this.excludePassword(user),
        };
    }
    async findUserById(id) {
        return this.userRepository.findById(id);
    }
    async findUserByEmail(email) {
        return this.userRepository.findByEmail(email);
    }
    async getProfile(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return this.excludePassword(user);
    }
    async updateProfile(userId, updateData) {
        const user = await this.userRepository.updateUser(userId, updateData);
        return this.excludePassword(user);
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const isCurrentPasswordValid = await this.userRepository.verifyPassword(user, currentPassword);
        if (!isCurrentPasswordValid) {
            throw new common_1.BadRequestException('Current password is incorrect');
        }
        await this.userRepository.updatePassword(userId, newPassword);
    }
    async refreshToken(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('User not found or inactive');
        }
        const payload = { sub: user.id, email: user.email };
        const expiresIn = 3600;
        return {
            accessToken: this.jwtService.sign(payload, { expiresIn }),
            expiresIn,
        };
    }
    async logout(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
    }
    async deactivateAccount(userId) {
        await this.userRepository.toggleUserStatus(userId, false);
    }
    async reactivateAccount(userId) {
        await this.userRepository.toggleUserStatus(userId, true);
    }
    async generateTokens(user) {
        const payload = { sub: user.id, email: user.email };
        const expiresIn = 3600;
        const accessToken = this.jwtService.sign(payload, { expiresIn });
        return {
            accessToken,
            expiresIn,
        };
    }
    excludePassword(user) {
        const { password, userType, userTypeId, ...userWithoutPassword } = user;
        const isAdmin = this.userRepository.isAdmin(user);
        const result = {
            ...userWithoutPassword,
        };
        if (isAdmin) {
            result.isAdmin = true;
        }
        return result;
    }
    async verifyToken(token) {
        try {
            return this.jwtService.verify(token);
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
    }
    async googleLogin(googleUser) {
        let user = await this.userRepository.findByEmail(googleUser.email);
        if (!user) {
            user = await this.userRepository.createUser({
                email: googleUser.email,
                password: null,
                firstName: googleUser.firstName,
                lastName: googleUser.lastName,
                avatar: googleUser.avatar,
            });
        }
        else if (!user.isActive) {
            throw new common_1.UnauthorizedException('Account is inactive');
        }
        const tokens = await this.generateTokens(user);
        return {
            ...tokens,
            user: this.excludePassword(user),
        };
    }
    async promoteToAdmin(userId) {
        const user = await this.userRepository.setUserAsAdmin(userId);
        return this.excludePassword(user);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map