import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
  Res,
} from '@nestjs/common';
import { AuthService } from '../../../services/auth/auth.service';
import { RegisterDto, LoginDto, AuthResponseDto, UserResponseDto } from '../dto';
import { LocalAuthGuard, JwtAuthGuard, GoogleAuthGuard } from '../guards';
import { Public, CurrentUser } from '../decorators';
import { User } from '@prisma/client';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Register a new user
   */
  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  /**
   * Login user with email and password
   */
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async login(
    @Body() loginDto: LoginDto,
    @Request() req: any,
  ): Promise<AuthResponseDto> {
    // The LocalAuthGuard validates the user and attaches it to the request
    return this.authService.login(req.user);
  }

  /**
   * Get current user profile
   */
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@CurrentUser() user: User): Promise<UserResponseDto> {
    return this.authService.getProfile(user.id);
  }

  /**
   * Update user profile
   */
  @UseGuards(JwtAuthGuard)
  @Put('profile')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateProfile(
    @CurrentUser() user: User,
    @Body()
    updateData: {
      firstName?: string;
      lastName?: string;
      avatar?: string;
    },
  ): Promise<UserResponseDto> {
    return this.authService.updateProfile(user.id, updateData);
  }

  /**
   * Change user password
   */
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async changePassword(
    @CurrentUser() user: User,
    @Body()
    passwordData: {
      currentPassword: string;
      newPassword: string;
    },
  ): Promise<void> {
    await this.authService.changePassword(
      user.id,
      passwordData.currentPassword,
      passwordData.newPassword,
    );
  }

  /**
   * Refresh JWT token
   */
  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @CurrentUser() user: User,
  ): Promise<{ accessToken: string; expiresIn: number }> {
    return this.authService.refreshToken(user.id);
  }

  /**
   * Logout user
   */
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@CurrentUser() user: User): Promise<void> {
    await this.authService.logout(user.id);
  }

  /**
   * Get current user info (minimal endpoint for checking auth status)
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@CurrentUser() user: User): Promise<UserResponseDto> {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Deactivate user account
   */
  @UseGuards(JwtAuthGuard)
  @Post('deactivate')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deactivateAccount(@CurrentUser() user: User): Promise<void> {
    await this.authService.deactivateAccount(user.id);
  }

  /**
   * Reactivate user account (admin endpoint - you might want to add role-based guards)
   */
  @UseGuards(JwtAuthGuard)
  @Post('reactivate')
  @HttpCode(HttpStatus.NO_CONTENT)
  async reactivateAccount(@CurrentUser() user: User): Promise<void> {
    await this.authService.reactivateAccount(user.id);
  }

  /**
   * Google OAuth login - initiates the OAuth flow
   */
  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  async googleAuth(): Promise<void> {
    // This endpoint initiates the Google OAuth flow
    // The actual redirect is handled by the GoogleAuthGuard
  }

  /**
   * Google OAuth callback - handles the callback from Google
   */
  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleAuthCallback(
    @Request() req: any,
    @Res() res: Response,
  ): Promise<void> {
    try {
      // The GoogleAuthGuard populates req.user with the Google profile data
      const googleUser = {
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        avatar: req.user.avatar,
      };

      const authResult = await this.authService.googleLogin(googleUser);
      
      // Get frontend URL from config
      const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
      
      // Redirect to frontend with token and user data as URL parameters
      const redirectUrl = new URL(`${frontendUrl}/auth/callback`);
      redirectUrl.searchParams.set('token', authResult.accessToken);
      redirectUrl.searchParams.set('expires', authResult.expiresIn.toString());
      redirectUrl.searchParams.set('user', JSON.stringify(authResult.user));
      
      res.redirect(redirectUrl.toString());
    } catch (error) {
      // Redirect to frontend with error
      const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
      const errorUrl = new URL(`${frontendUrl}/auth/error`);
      errorUrl.searchParams.set('error', 'authentication_failed');
      errorUrl.searchParams.set('message', error.message || 'Google authentication failed');
      
      res.redirect(errorUrl.toString());
    }
  }

  /**
   * Google OAuth callback (JSON response) - for API clients
   */
  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback/json')
  async googleAuthCallbackJson(@Request() req: any): Promise<AuthResponseDto> {
    // The GoogleAuthGuard populates req.user with the Google profile data
    const googleUser = {
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      avatar: req.user.avatar,
    };

    return this.authService.googleLogin(googleUser);
  }
}
