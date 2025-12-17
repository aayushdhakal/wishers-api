import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { CreditRepository } from '../../database/repositories/credit.repository';
import {
  CreateCreditPackageDto,
  UpdateCreditPackageDto,
  PurchaseCreditsDto,
  AddBonusDto,
  UseCreditsDto,
} from '../../modules/credit/dto';
import {
  CreditPackage,
  CreditTransaction,
  CreditTransactionType,
  PaymentMethod,
  User,
} from '@prisma/client';
import { UserRepository } from '../../database/repositories/user.repository';

@Injectable()
export class CreditService {
  constructor(
    private readonly creditRepository: CreditRepository, 
    private readonly userRepository: UserRepository
  ) {}

  // ==================== User Credit Operations ====================

  /**
   * Get user credit balance
   */
  async getBalance(userId: string): Promise<{ balance: number }> {
    const balance = await this.creditRepository.getUserCreditBalance(userId);
    return { balance };
  }

  /**
   * Get user credit account with transactions
   */
  async getUserCredit(userId: string) {
    const userCredit = await this.creditRepository.findUserCreditByUserId(userId);
    if (!userCredit) {
      return {
        balance: 0,
        transactions: [],
      };
    }
    return {
      balance: Number(userCredit.balance),
      transactions: userCredit.transactions,
    };
  }

  /**
   * Get user transaction history
   */
  async getTransactionHistory(
    userId: string,
    options?: {
      type?: CreditTransactionType;
      skip?: number;
      take?: number;
    },
  ) {
    return this.creditRepository.findCreditTransactionsByUserId(userId, options);
  }
  /**
   * Get all purchase methods
   */
  async getPurchaseMethods(): Promise<PaymentMethod[]> {
    return Object.values(PaymentMethod) as PaymentMethod[];
  }

  /**
   * Get user transaction statistics
   */
  async getTransactionStatistics(user: User) {
    return this.creditRepository.getTransactionStatistics(user.id);
  }

  // ==================== Credit Package Operations ====================

  /**
   * Get all active credit packages (public endpoint)
   */
  async getActivePackages(): Promise<CreditPackage[]> {
    return this.creditRepository.findActiveCreditPackages();
  }

  /**
   * Get all credit packages (admin only)
   */
  async getAllPackages(options?: { isActive?: boolean; skip?: number; take?: number }) {
    return this.creditRepository.findAllCreditPackages(options);
  }

  /**
   * Get credit package by ID
   */
  async getPackageById(id: string): Promise<CreditPackage> {
    const package_ = await this.creditRepository.findCreditPackageById(id);
    if (!package_) {
      throw new NotFoundException('Credit package not found');
    }
    return package_;
  }

  /**
   * Create a new credit package (admin only)
   */
  async createPackage(user: User, createDto: CreateCreditPackageDto): Promise<CreditPackage> {
    const isAdmin = this.userRepository.isAdmin(user);
    if (!isAdmin) {
      throw new ForbiddenException('You are not authorized to create a credit package');
    }
    return this.creditRepository.createCreditPackage(createDto);
  }

  /**
   * Update credit package (admin only)
   */
  async updatePackage(user: User, id: string, updateDto: UpdateCreditPackageDto): Promise<CreditPackage> {
    const isAdmin = this.userRepository.isAdmin(user);
    if (!isAdmin) {
      throw new ForbiddenException('You are not authorized to create a credit package');
    }
    const package_ = await this.creditRepository.findCreditPackageById(id);
    if (!package_) {
      throw new NotFoundException('Credit package not found');
    }
    return this.creditRepository.updateCreditPackage(id, updateDto);
  }

  /**
   * Delete credit package (admin only)
   */
  async deletePackage(user: User, id: string): Promise<void> {
    const isAdmin = this.userRepository.isAdmin(user);
    if (!isAdmin) {
      throw new ForbiddenException('You are not authorized to create a credit package');
    }
    const package_ = await this.creditRepository.findCreditPackageById(id);
    if (!package_) {
      throw new NotFoundException('Credit package not found');
    }
    await this.creditRepository.deleteCreditPackage(id);
  }

  // ==================== Credit Purchase Operations ====================

  /**
   * Process credit purchase
   */
  async purchaseCredits(
    userId: string,
    purchaseDto: PurchaseCreditsDto,
  ): Promise<CreditTransaction> {
    // Validate package exists
    const package_ = await this.creditRepository.findCreditPackageById(purchaseDto.packageId);
    if (!package_) {
      throw new NotFoundException('Credit package not found');
    }

    if (!package_.isActive) {
      throw new BadRequestException('Credit package is not active');
    }

    // Process the purchase
    return this.creditRepository.processCreditPurchase(
      userId,
      purchaseDto.packageId,
      purchaseDto.paymentMethod,
      purchaseDto.paymentId,
    );
  }

  // ==================== Bonus Operations ====================

  /**
   * Add bonus credits to a user (admin only)
   */
  async addBonus(userId: string, addBonusDto: AddBonusDto): Promise<CreditTransaction> {
    if (userId !== addBonusDto.userId) {
      // Only allow if user is adding to themselves, or implement admin check
      throw new ForbiddenException('You can only add bonuses to your own account');
    }

    return this.creditRepository.addBonusCredits(
      addBonusDto.userId,
      addBonusDto.amount,
      addBonusDto.description,
    );
  }

  /**
   * Add bonus credits (admin function - can add to any user)
   */
  async addBonusToUser(
    targetUserId: string,
    amount: number,
    description?: string,
  ): Promise<CreditTransaction> {
    return this.creditRepository.addBonusCredits(targetUserId, amount, description);
  }

  // ==================== Credit Usage Operations ====================

  /**
   * Use credits
   */
  async useCredits(userId: string, useCreditsDto: UseCreditsDto): Promise<CreditTransaction> {
    const balance = await this.creditRepository.getUserCreditBalance(userId);

    if (balance < useCreditsDto.amount) {
      throw new BadRequestException('Insufficient credits');
    }

    return this.creditRepository.useCredits(
      userId,
      useCreditsDto.amount,
      useCreditsDto.description,
    );
  }
}

