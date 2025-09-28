import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserRepository } from '../../database/repositories/user.repository';
import { RegisterDto, AuthResponseDto, UserResponseDto } from '../../modules/auth/dto';
import { JwtPayload } from '../../modules/auth/strategies/jwt.strategy';
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: UserRepository, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<AuthResponseDto>;
    validateUser(email: string, password: string): Promise<User | null>;
    login(user: User): Promise<AuthResponseDto>;
    findUserById(id: string): Promise<User | null>;
    findUserByEmail(email: string): Promise<User | null>;
    getProfile(userId: string): Promise<UserResponseDto>;
    updateProfile(userId: string, updateData: {
        firstName?: string;
        lastName?: string;
        avatar?: string;
    }): Promise<UserResponseDto>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
    refreshToken(userId: string): Promise<{
        accessToken: string;
        expiresIn: number;
    }>;
    logout(userId: string): Promise<void>;
    deactivateAccount(userId: string): Promise<void>;
    reactivateAccount(userId: string): Promise<void>;
    private generateTokens;
    private excludePassword;
    verifyToken(token: string): Promise<JwtPayload>;
    googleLogin(googleUser: {
        email: string;
        firstName: string;
        lastName: string;
        avatar?: string;
    }): Promise<AuthResponseDto>;
}
