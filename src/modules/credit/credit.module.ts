import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { CreditController } from './controllers/credit.controller';
import { CreditService } from '../../services/credit/credit.service';
import { CreditRepository } from '../../database/repositories/credit.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [CreditController],
  providers: [CreditService, CreditRepository],
  exports: [CreditService, CreditRepository],
})
export class CreditModule {}

