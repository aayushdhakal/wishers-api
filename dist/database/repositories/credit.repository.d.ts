import { UserCredit, CreditTransaction, CreditPackage, CreditTransactionType, CreditTransactionStatus, PaymentMethod, Prisma } from '@prisma/client';
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
export declare class CreditRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createUserCredit(data: CreateUserCreditData): Promise<UserCredit>;
    getOrCreateUserCredit(userId: string): Promise<UserCredit>;
    findUserCreditByUserId(userId: string): Promise<UserCreditWithTransactions | null>;
    findUserCreditById(id: string): Promise<UserCreditWithTransactions | null>;
    updateUserCredit(userId: string, data: UpdateUserCreditData): Promise<UserCredit>;
    getUserCreditBalance(userId: string): Promise<number>;
    deleteUserCredit(userId: string): Promise<UserCredit>;
    findAllUserCredits(options?: {
        skip?: number;
        take?: number;
        orderBy?: Prisma.UserCreditOrderByWithRelationInput;
    }): Promise<UserCredit[]>;
    createCreditTransaction(data: CreateCreditTransactionData): Promise<CreditTransaction>;
    findCreditTransactionById(id: string): Promise<CreditTransactionWithUser | null>;
    findCreditTransactionsByUserId(userId: string, options?: {
        type?: CreditTransactionType;
        status?: CreditTransactionStatus;
        skip?: number;
        take?: number;
        orderBy?: Prisma.CreditTransactionOrderByWithRelationInput;
    }): Promise<CreditTransaction[]>;
    findCreditTransactionsByUserCreditId(userCreditId: string, options?: {
        type?: CreditTransactionType;
        status?: CreditTransactionStatus;
        skip?: number;
        take?: number;
    }): Promise<CreditTransaction[]>;
    updateCreditTransaction(id: string, data: UpdateCreditTransactionData): Promise<CreditTransaction>;
    findAllCreditTransactions(options?: {
        type?: CreditTransactionType;
        status?: CreditTransactionStatus;
        userId?: string;
        skip?: number;
        take?: number;
        orderBy?: Prisma.CreditTransactionOrderByWithRelationInput;
    }): Promise<CreditTransactionWithUser[]>;
    deleteCreditTransaction(id: string): Promise<CreditTransaction>;
    getTransactionStatistics(userId: string): Promise<{
        totalPurchases: number;
        totalUsage: number;
        totalBonuses: number;
        totalRefunds: number;
        totalTransactions: number;
    }>;
    createCreditPackage(data: CreateCreditPackageData): Promise<CreditPackage>;
    findCreditPackageById(id: string): Promise<CreditPackage | null>;
    findActiveCreditPackages(): Promise<CreditPackage[]>;
    findAllCreditPackages(options?: {
        isActive?: boolean;
        skip?: number;
        take?: number;
        orderBy?: Prisma.CreditPackageOrderByWithRelationInput;
    }): Promise<CreditPackage[]>;
    updateCreditPackage(id: string, data: UpdateCreditPackageData): Promise<CreditPackage>;
    deleteCreditPackage(id: string): Promise<CreditPackage>;
    addBonusCredits(userId: string, amount: number, description?: string, metadata?: Record<string, any>): Promise<CreditTransaction>;
    processCreditPurchase(userId: string, packageId: string, paymentMethod: PaymentMethod, paymentId: string, metadata?: Record<string, any>): Promise<CreditTransaction>;
    useCredits(userId: string, amount: number, description?: string, metadata?: Record<string, any>): Promise<CreditTransaction>;
}
