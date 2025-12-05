import { CreditRepository } from '../../database/repositories/credit.repository';
import { CreateCreditPackageDto, UpdateCreditPackageDto, PurchaseCreditsDto, AddBonusDto, UseCreditsDto } from '../../modules/credit/dto';
import { CreditPackage, CreditTransaction, CreditTransactionType } from '@prisma/client';
export declare class CreditService {
    private readonly creditRepository;
    constructor(creditRepository: CreditRepository);
    getBalance(userId: string): Promise<{
        balance: number;
    }>;
    getUserCredit(userId: string): Promise<{
        balance: number;
        transactions: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            description: string | null;
            userCreditId: string;
            type: import(".prisma/client").$Enums.CreditTransactionType;
            status: import(".prisma/client").$Enums.CreditTransactionStatus;
            amount: import("@prisma/client/runtime/library").Decimal;
            balanceBefore: import("@prisma/client/runtime/library").Decimal;
            balanceAfter: import("@prisma/client/runtime/library").Decimal;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod | null;
            paymentId: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        }[];
    }>;
    getTransactionHistory(userId: string, options?: {
        type?: CreditTransactionType;
        skip?: number;
        take?: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        description: string | null;
        userCreditId: string;
        type: import(".prisma/client").$Enums.CreditTransactionType;
        status: import(".prisma/client").$Enums.CreditTransactionStatus;
        amount: import("@prisma/client/runtime/library").Decimal;
        balanceBefore: import("@prisma/client/runtime/library").Decimal;
        balanceAfter: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod | null;
        paymentId: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }[]>;
    getTransactionStatistics(userId: string): Promise<{
        totalPurchases: number;
        totalUsage: number;
        totalBonuses: number;
        totalRefunds: number;
        totalTransactions: number;
    }>;
    getActivePackages(): Promise<CreditPackage[]>;
    getAllPackages(options?: {
        isActive?: boolean;
        skip?: number;
        take?: number;
    }): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        credits: import("@prisma/client/runtime/library").Decimal;
        price: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        bonusCredits: import("@prisma/client/runtime/library").Decimal;
        displayOrder: number;
    }[]>;
    getPackageById(id: string): Promise<CreditPackage>;
    createPackage(createDto: CreateCreditPackageDto): Promise<CreditPackage>;
    updatePackage(id: string, updateDto: UpdateCreditPackageDto): Promise<CreditPackage>;
    deletePackage(id: string): Promise<void>;
    purchaseCredits(userId: string, purchaseDto: PurchaseCreditsDto): Promise<CreditTransaction>;
    addBonus(userId: string, addBonusDto: AddBonusDto): Promise<CreditTransaction>;
    addBonusToUser(targetUserId: string, amount: number, description?: string): Promise<CreditTransaction>;
    useCredits(userId: string, useCreditsDto: UseCreditsDto): Promise<CreditTransaction>;
}
