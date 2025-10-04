import { Injectable } from '@nestjs/common';
import { User, Account, AuthProvider, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcryptjs';
import { CreateUserData, CreateOAuthUserData, UpdateUserData } from '../../services/interface/auth/user.interface';

// Re-export interfaces for external use
export type { CreateUserData, CreateOAuthUserData, UpdateUserData };

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new user with email/password (local strategy)
   */
  async createUser(data: CreateUserData): Promise<User> {
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
      }, // Type assertion until Prisma types refresh
      include: {
        accounts: true,
      },
    });
  }

  /**
   * Create a new user with OAuth provider (Google/Facebook)
   */
  async createOAuthUser(data: CreateOAuthUserData): Promise<User> {
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

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        accounts: true,
        userType: true,
      },
    });
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        accounts: true,
        userType: true,
      },
    });
  }

  /**
   * Find user by OAuth provider and provider account ID
   */
  async findByProvider(
    provider: AuthProvider,
    providerAccountId: string,
  ): Promise<User | null> {
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

  /**
   * Check if user is admin
   */
  isAdmin(user: User & { userType?: { name: string } | null }): boolean {
    return user.userType?.name?.toLowerCase() === 'admin';
  }

  /**
   * Set user as admin
   */
  async setUserAsAdmin(userId: string): Promise<User> {
    // First, ensure admin user type exists
    const adminUserType = await this.prisma.userType.upsert({
      where: { name: 'admin' },
      update: {},
      create: {
        name: 'admin',
        description: 'Administrator user type',
        isActive: true,
      },
    });

    // Update user to admin type
    return this.prisma.user.update({
      where: { id: userId },
      data: { userTypeId: adminUserType.id },
      include: {
        accounts: true,
        userType: true,
      },
    });
  }

  /**
   * Update user information
   */
  async updateUser(id: string, data: UpdateUserData): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
      include: {
        accounts: true,
      },
    });
  }

  /**
   * Update user password
   */
  async updatePassword(id: string, newPassword: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    return this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
      include: {
        accounts: true,
      },
    });
  }

  /**
   * Verify user password
   */
  async verifyPassword(user: User, password: string): Promise<boolean> {
    if (!user.password) {
      return false; // OAuth users don't have passwords
    }
    
    return bcrypt.compare(password, user.password);
  }

  /**
   * Link OAuth account to existing user
   */
  async linkOAuthAccount(
    userId: string,
    provider: AuthProvider,
    providerAccountId: string,
    accountData: Partial<Account>,
  ): Promise<Account> {
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

  /**
   * Update OAuth account tokens
   */
  async updateOAuthTokens(
    provider: AuthProvider,
    providerAccountId: string,
    tokens: {
      accessToken?: string;
      refreshToken?: string;
      expiresAt?: Date;
      idToken?: string;
    },
  ): Promise<Account> {
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

  /**
   * Delete user account
   */
  async deleteUser(id: string): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
      include: {
        accounts: true,
      },
    });
  }

  /**
   * Get all users (for admin purposes)
   */
  async findAll(
    skip?: number,
    take?: number,
    where?: Prisma.UserWhereInput,
  ): Promise<User[]> {
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

  /**
   * Count users
   */
  async count(where?: Prisma.UserWhereInput): Promise<number> {
    return this.prisma.user.count({ where });
  }

  /**
   * Check if user exists by email
   */
  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    return !!user;
  }

  /**
   * Activate/Deactivate user
   */
  async toggleUserStatus(id: string, isActive: boolean): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { isActive },
      include: {
        accounts: true,
      },
    });
  }
}
