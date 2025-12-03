import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserRepository } from './repositories/user.repository';
import { CreditRepository } from './repositories/credit.repository';

@Global()
@Module({
  providers: [PrismaService, UserRepository, CreditRepository],
  exports: [PrismaService, UserRepository, CreditRepository],
})
export class DatabaseModule {}
