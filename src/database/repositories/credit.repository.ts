import { Injectable } from '@nestjs/common';
import {
  UserCredit,
  CreditTransaction,
  CreditPackage,
  CreditTransactionType,
  CreditTransactionStatus,
  PaymentMethod,
  Prisma,
} from '@prisma/client';
import { PrismaService } from '../prisma.service';

export type UserCreditWithTransactions = UserCredit & {
  transactions: CreditTransaction[];
};

export type CreditTransactionWithUser = CreditTransaction & {
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
  userCredit: UserCredit;
};

export interface CreateUserCreditData {
  userId: string;
  balance?: number;
}

export interface UpdateUserCreditData {
  balance?: number;
}

export interface CreateCreditTransactionData {
  userId: string;
  userCreditId: string;
  type: CreditTransactionType;
  status?: CreditTransactionStatus;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description?: string;
  paymentMethod?: PaymentMethod;
  paymentId?: string;
  metadata?: Record<string, any>;
}

export interface UpdateCreditTransactionData {
  status?: CreditTransactionStatus;
  description?: string;
  metadata?: Record<string, any>;
}

export interface CreateCreditPackageData {
  name: string;
  description?: string;
  credits: number;
  price: number;
  currency?: string;
  bonusCredits?: number;
  isActive?: boolean;
  displayOrder?: number;
}

export interface UpdateCreditPackageData {
  name?: string;
  description?: string;
  credits?: number;
  price?: number;
  currency?: string;
  bonusCredits?: number;
  isActive?: boolean;
  displayOrder?: number;
}

@Injectable()
export class CreditRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ==================== UserCredit CRUD Operations ====================

  /**
   * Create a new user credit account
   */
  async createUserCredit(data: CreateUserCreditData): Promise<UserCredit> {
    return this.prisma.userCredit.create({
      data: {
        userId: data.userId,
        balance: data.balance || 0,
      },
    });
  }

  /**
   * Get or create user credit account
   */
  async getOrCreateUserCredit(userId: string): Promise<UserCredit> {
    return this.prisma.userCredit.upsert({
      where: { userId },
      update: {},
      create: {
        userId,
        balance: 0,
      },
    });
  }

  /**
   * Find user credit by user ID
   */
  async findUserCreditByUserId(
    userId: string,
  ): Promise<UserCreditWithTransactions | null> {
    return this.prisma.userCredit.findUnique({
      where: { userId },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 10, // Get last 10 transactions
        },
      },
    });
  }

  /**
   * Find user credit by ID
   */
  async findUserCreditById(id: string): Promise<UserCreditWithTransactions | null> {
    return this.prisma.userCredit.findUnique({
      where: { id },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  /**
   * Update user credit balance
   */
  async updateUserCredit(
    userId: string,
    data: UpdateUserCreditData,
  ): Promise<UserCredit> {
    return this.prisma.userCredit.update({
      where: { userId },
      data: {
        balance: data.balance,
      },
    });
  }

  /**
   * Get user credit balance
   */
  async getUserCreditBalance(userId: string): Promise<number> {
    const userCredit = await this.getOrCreateUserCredit(userId);
    return Number(userCredit.balance);
  }

  /**
   * Delete user credit (cascade delete will handle transactions)
   */
  async deleteUserCredit(userId: string): Promise<UserCredit> {
    return this.prisma.userCredit.delete({
      where: { userId },
    });
  }

  /**
   * Find all user credits with pagination
   */
  async findAllUserCredits(
    options?: {
      skip?: number;
      take?: number;
      orderBy?: Prisma.UserCreditOrderByWithRelationInput;
    },
  ): Promise<UserCredit[]> {
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

  // ==================== CreditTransaction CRUD Operations ====================

  /**
   * Create a new credit transaction
   */
  async createCreditTransaction(
    data: CreateCreditTransactionData,
  ): Promise<CreditTransaction> {
    return this.prisma.creditTransaction.create({
      data: {
        userId: data.userId,
        userCreditId: data.userCreditId,
        type: data.type,
        status: data.status || CreditTransactionStatus.PENDING,
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

  /**
   * Find credit transaction by ID
   */
  async findCreditTransactionById(
    id: string,
  ): Promise<CreditTransactionWithUser | null> {
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

  /**
   * Find credit transactions by user ID
   */
  async findCreditTransactionsByUserId(
    userId: string,
    options?: {
      type?: CreditTransactionType;
      status?: CreditTransactionStatus;
      skip?: number;
      take?: number;
      orderBy?: Prisma.CreditTransactionOrderByWithRelationInput;
    },
  ): Promise<CreditTransaction[]> {
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

  /**
   * Find credit transactions by user credit ID
   */
  async findCreditTransactionsByUserCreditId(
    userCreditId: string,
    options?: {
      type?: CreditTransactionType;
      status?: CreditTransactionStatus;
      skip?: number;
      take?: number;
    },
  ): Promise<CreditTransaction[]> {
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

  /**
   * Update credit transaction
   */
  async updateCreditTransaction(
    id: string,
    data: UpdateCreditTransactionData,
  ): Promise<CreditTransaction> {
    return this.prisma.creditTransaction.update({
      where: { id },
      data: {
        status: data.status,
        description: data.description,
        metadata: data.metadata,
      },
    });
  }

  /**
   * Find all credit transactions with filters
   */
  async findAllCreditTransactions(
    options?: {
      type?: CreditTransactionType;
      status?: CreditTransactionStatus;
      userId?: string;
      skip?: number;
      take?: number;
      orderBy?: Prisma.CreditTransactionOrderByWithRelationInput;
    },
  ): Promise<CreditTransactionWithUser[]> {
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

  /**
   * Delete credit transaction (use with caution - transactions should be immutable)
   */
  async deleteCreditTransaction(id: string): Promise<CreditTransaction> {
    return this.prisma.creditTransaction.delete({
      where: { id },
    });
  }

  /**
   * Get transaction statistics for a user
   */
  async getTransactionStatistics(userId: string): Promise<{
    totalPurchases: number;
    totalUsage: number;
    totalBonuses: number;
    totalRefunds: number;
    totalTransactions: number;
  }> {
    const transactions = await this.prisma.creditTransaction.findMany({
      where: {
        userId,
        status: CreditTransactionStatus.COMPLETED,
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
        case CreditTransactionType.PURCHASE:
          stats.totalPurchases += amount;
          break;
        case CreditTransactionType.USAGE:
          stats.totalUsage += Math.abs(amount); // Usage is negative
          break;
        case CreditTransactionType.BONUS:
          stats.totalBonuses += amount;
          break;
        case CreditTransactionType.REFUND:
          stats.totalRefunds += amount;
          break;
      }
    });

    return stats;
  }

  // ==================== CreditPackage CRUD Operations ====================

  /**
   * Create a new credit package
   */
  async createCreditPackage(data: CreateCreditPackageData): Promise<CreditPackage> {
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

  /**
   * Find credit package by ID
   */
  async findCreditPackageById(id: string): Promise<CreditPackage | null> {
    return this.prisma.creditPackage.findUnique({
      where: { id },
    });
  }

  /**
   * Find all active credit packages
   */
  async findActiveCreditPackages(): Promise<CreditPackage[]> {
    return this.prisma.creditPackage.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
  }

  /**
   * Find all credit packages
   */
  async findAllCreditPackages(
    options?: {
      isActive?: boolean;
      skip?: number;
      take?: number;
      orderBy?: Prisma.CreditPackageOrderByWithRelationInput;
    },
  ): Promise<CreditPackage[]> {
    return this.prisma.creditPackage.findMany({
      where: {
        ...(options?.isActive !== undefined && { isActive: options.isActive }),
      },
      skip: options?.skip,
      take: options?.take,
      orderBy: options?.orderBy || { displayOrder: 'asc' },
    });
  }

  /**
   * Update credit package
   */
  async updateCreditPackage(
    id: string,
    data: UpdateCreditPackageData,
  ): Promise<CreditPackage> {
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

  /**
   * Delete credit package
   */
  async deleteCreditPackage(id: string): Promise<CreditPackage> {
    return this.prisma.creditPackage.delete({
      where: { id },
    });
  }

  // ==================== Advanced Operations ====================

  /**
   * Add bonus credits to a user (atomic operation)
   */
  async addBonusCredits(
    userId: string,
    amount: number,
    description?: string,
    metadata?: Record<string, any>,
  ): Promise<CreditTransaction> {
    return this.prisma.$transaction(async (tx) => {
      // Get or create user credit account
      const userCredit = await tx.userCredit.upsert({
        where: { userId },
        update: {},
        create: {
          userId,
          balance: 0,
        },
      });

      // Record balance before
      const balanceBefore = Number(userCredit.balance);

      // Calculate new balance
      const balanceAfter = balanceBefore + amount;

      // Create transaction record
      const transaction = await tx.creditTransaction.create({
        data: {
          userId,
          userCreditId: userCredit.id,
          type: CreditTransactionType.BONUS,
          status: CreditTransactionStatus.COMPLETED,
          amount: amount,
          balanceBefore: balanceBefore,
          balanceAfter: balanceAfter,
          description: description || 'Bonus credits added',
          metadata: metadata || {},
        },
      });

      // Update user credit balance
      await tx.userCredit.update({
        where: { id: userCredit.id },
        data: {
          balance: balanceAfter,
        },
      });

      return transaction;
    });
  }

  /**
   * Process credit purchase (atomic operation)
   */
  async processCreditPurchase(
    userId: string,
    packageId: string,
    paymentMethod: PaymentMethod,
    paymentId: string,
    metadata?: Record<string, any>,
  ): Promise<CreditTransaction> {
    return this.prisma.$transaction(async (tx) => {
      // Get credit package
      const creditPackage = await tx.creditPackage.findUnique({
        where: { id: packageId },
      });

      if (!creditPackage) {
        throw new Error('Credit package not found');
      }

      if (!creditPackage.isActive) {
        throw new Error('Credit package is not active');
      }

      // Get or create user credit account
      const userCredit = await tx.userCredit.upsert({
        where: { userId },
        update: {},
        create: {
          userId,
          balance: 0,
        },
      });

      // Calculate total credits (package credits + bonus)
      const totalCredits =
        Number(creditPackage.credits) + Number(creditPackage.bonusCredits);

      // Record balance before
      const balanceBefore = Number(userCredit.balance);

      // Calculate new balance
      const balanceAfter = balanceBefore + totalCredits;

      // Create transaction record
      const transaction = await tx.creditTransaction.create({
        data: {
          userId,
          userCreditId: userCredit.id,
          type: CreditTransactionType.PURCHASE,
          status: CreditTransactionStatus.COMPLETED,
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

      // Update user credit balance
      await tx.userCredit.update({
        where: { id: userCredit.id },
        data: {
          balance: balanceAfter,
        },
      });

      return transaction;
    });
  }

  /**
   * Use credits (atomic operation)
   */
  async useCredits(
    userId: string,
    amount: number,
    description?: string,
    metadata?: Record<string, any>,
  ): Promise<CreditTransaction> {
    return this.prisma.$transaction(async (tx) => {
      // Get user credit account
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

      // Record balance before
      const balanceBefore = currentBalance;

      // Calculate new balance
      const balanceAfter = balanceBefore - amount;

      // Create transaction record (amount is negative for usage)
      const transaction = await tx.creditTransaction.create({
        data: {
          userId,
          userCreditId: userCredit.id,
          type: CreditTransactionType.USAGE,
          status: CreditTransactionStatus.COMPLETED,
          amount: -amount, // Negative for usage
          balanceBefore: balanceBefore,
          balanceAfter: balanceAfter,
          description: description || 'Credits used',
          metadata: metadata || {},
        },
      });

      // Update user credit balance
      await tx.userCredit.update({
        where: { id: userCredit.id },
        data: {
          balance: balanceAfter,
        },
      });

      return transaction;
    });
  }
}

