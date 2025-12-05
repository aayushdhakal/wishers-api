import { IsString, IsEnum } from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class PurchaseCreditsDto {
  @IsString()
  packageId: string;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsString()
  paymentId: string;
}

