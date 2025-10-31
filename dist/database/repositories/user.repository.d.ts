import { User, Account, AuthProvider, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateUserData, CreateOAuthUserData, UpdateUserData } from '../../services/interface/auth/user.interface';
export type { CreateUserData, CreateOAuthUserData, UpdateUserData };
export declare class UserRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createUser(data: CreateUserData): Promise<User>;
    createOAuthUser(data: CreateOAuthUserData): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    findByProvider(provider: AuthProvider, providerAccountId: string): Promise<User | null>;
    isAdmin(user: User & {
        userType?: {
            name: string;
            isActive: boolean;
        } | null;
    }): boolean;
    setUserAsAdmin(userId: string): Promise<User>;
    updateUser(id: string, data: UpdateUserData): Promise<User>;
    updatePassword(id: string, newPassword: string): Promise<User>;
    verifyPassword(user: User, password: string): Promise<boolean>;
    linkOAuthAccount(userId: string, provider: AuthProvider, providerAccountId: string, accountData: Partial<Account>): Promise<Account>;
    updateOAuthTokens(provider: AuthProvider, providerAccountId: string, tokens: {
        accessToken?: string;
        refreshToken?: string;
        expiresAt?: Date;
        idToken?: string;
    }): Promise<Account>;
    deleteUser(id: string): Promise<User>;
    findAll(skip?: number, take?: number, where?: Prisma.UserWhereInput): Promise<User[]>;
    count(where?: Prisma.UserWhereInput): Promise<number>;
    existsByEmail(email: string): Promise<boolean>;
    toggleUserStatus(id: string, isActive: boolean): Promise<User>;
}
