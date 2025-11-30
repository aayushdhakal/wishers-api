import { AuthService } from '../../../services/auth/auth.service';
import { RegisterDto, LoginDto, AuthResponseDto, UserResponseDto } from '../dto';
import { User } from '@prisma/client';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
export declare class AuthController {
    private readonly authService;
    private readonly configService;
    constructor(authService: AuthService, configService: ConfigService);
    register(registerDto: RegisterDto): Promise<AuthResponseDto>;
    login(loginDto: LoginDto, req: any): Promise<AuthResponseDto>;
    getProfile(user: User): Promise<UserResponseDto>;
    updateProfile(user: User, updateData: {
        firstName?: string;
        lastName?: string;
        avatar?: string;
    }): Promise<UserResponseDto>;
    changePassword(user: User, passwordData: {
        currentPassword: string;
        newPassword: string;
    }): Promise<void>;
    refreshToken(user: User): Promise<{
        accessToken: string;
        expiresIn: number;
    }>;
    logout(user: User): Promise<void>;
    getCurrentUser(user: User): Promise<UserResponseDto>;
    deactivateAccount(user: User): Promise<void>;
    reactivateAccount(user: User): Promise<void>;
    googleAuth(): Promise<void>;
    googleAuthCallback(req: any, res: Response): Promise<void>;
    googleAuthCallbackJson(req: any): Promise<AuthResponseDto>;
    authCallback(token: string, expires: string, user: string): Promise<AuthResponseDto>;
}
