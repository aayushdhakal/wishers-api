import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { CreditService } from '../../../services/credit/credit.service';
import {
  CreateCreditPackageDto,
  UpdateCreditPackageDto,
  PurchaseCreditsDto,
  AddBonusDto,
  UseCreditsDto,
} from '../dto';
import { JwtAuthGuard } from '../../auth/guards';
import { CurrentUser } from '../../auth/decorators';
import { User } from '@prisma/client';
import { CreditTransactionType } from '@prisma/client';

@Controller('credits')
@UseGuards(JwtAuthGuard)
export class CreditController {
  constructor(private readonly creditService: CreditService) {}

  // ==================== User Credit Endpoints ====================

  /**
   * Get current user's credit balance
   */
  @Get('balance')
  async getBalance(@CurrentUser() user: User) {
    return this.creditService.getBalance(user.id);
  }

  /**
   * Get current user's credit account with recent transactions
   */
  @Get('account')
  async getAccount(@CurrentUser() user: User) {
    return this.creditService.getUserCredit(user.id);
  }

  /**
   * Get current user's transaction history
   */
  @Get('transactions')
  async getTransactionHistory(
    @CurrentUser() user: User,
    @Query('type') type?: CreditTransactionType,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    const skip = (page - 1) * limit;
    return this.creditService.getTransactionHistory(user.id, {
      type,
      skip,
      take: limit,
    });
  }

  /**
   * Get current user's transaction statistics
   */
  @Get('statistics')
  async getStatistics(@CurrentUser() user: User) {
    return this.creditService.getTransactionStatistics(user.id);
  }

  // ==================== Credit Package Endpoints ====================

  /**
   * Get all active credit packages (public for authenticated users)
   */
  @Get('packages')
  async getActivePackages() {
    return this.creditService.getActivePackages();
  }

  /**
   * Get credit package by ID
   */
  @Get('packages/:id')
  async getPackageById(@Param('id') id: string) {
    return this.creditService.getPackageById(id);
  }

  /**
   * Create a new credit package (admin only - add admin guard later)
   */
  @Post('packages')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createPackage(@Body() createDto: CreateCreditPackageDto) {
    return this.creditService.createPackage(createDto);
  }

  /**
   * Update credit package (admin only - add admin guard later)
   */
  @Put('packages/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updatePackage(@Param('id') id: string, @Body() updateDto: UpdateCreditPackageDto) {
    return this.creditService.updatePackage(id, updateDto);
  }

  /**
   * Delete credit package (admin only - add admin guard later)
   */
  @Delete('packages/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePackage(@Param('id') id: string) {
    await this.creditService.deletePackage(id);
  }

  // ==================== Credit Purchase Endpoints ====================

  /**
   * Purchase credits
   */
  @Post('purchase')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async purchaseCredits(
    @CurrentUser() user: User,
    @Body() purchaseDto: PurchaseCreditsDto,
  ) {
    return this.creditService.purchaseCredits(user.id, purchaseDto);
  }

  // ==================== Bonus Endpoints ====================

  /**
   * Add bonus credits to current user
   */
  @Post('bonus')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async addBonus(@CurrentUser() user: User, @Body() addBonusDto: AddBonusDto) {
    // Ensure user can only add to their own account
    if (addBonusDto.userId !== user.id) {
      addBonusDto.userId = user.id;
    }
    return this.creditService.addBonus(user.id, addBonusDto);
  }

  // ==================== Credit Usage Endpoints ====================

  /**
   * Use credits
   */
  @Post('use')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async useCredits(@CurrentUser() user: User, @Body() useCreditsDto: UseCreditsDto) {
    return this.creditService.useCredits(user.id, useCreditsDto);
  }
}

