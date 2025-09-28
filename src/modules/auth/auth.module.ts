import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from '../../database/database.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from '../../services/auth/auth.service';
import { LocalStrategy, JwtStrategy, GoogleStrategy } from './strategies';
import { JwtAuthGuard, LocalAuthGuard, GoogleAuthGuard } from './guards';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('auth.jwt.secret'),
        signOptions: { 
          expiresIn: configService.get<string>('auth.jwt.expiresIn'),
          issuer: configService.get<string>('auth.jwt.issuer'),
          audience: configService.get<string>('auth.jwt.audience'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    JwtAuthGuard,
    LocalAuthGuard,
    GoogleAuthGuard,
  ],
  exports: [
    AuthService,
    JwtAuthGuard,
    LocalAuthGuard,
    GoogleAuthGuard,
    JwtModule,
    PassportModule,
  ],
})
export class AuthModule {}
