import { PaymentMethod } from '@prisma/client';
export declare class PurchaseCreditsDto {
    packageId: string;
    paymentMethod: PaymentMethod;
    paymentId: string;
}
