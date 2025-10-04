import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserRepository } from '../../database/repositories/user.repository';
import { RegisterDto, LoginDto, AuthResponseDto, UserResponseDto } from '../../modules/auth/dto';
import { JwtPayload } from '../../modules/auth/strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Register a new user
   */
  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, firstName, lastName, avatar } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create new user
    const user = await this.userRepository.createUser({
      email,
      password,
      firstName,
      lastName,
      avatar,
    });

    // Generate JWT tokens
    const tokens = await this.generateTokens(user);

    return {
      ...tokens,
      user: this.excludePassword(user),
    };
  }

  /**
   * Validate user credentials for local strategy
   */
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    
    if (!user || !user.isActive) {
      return null;
    }

    const isPasswordValid = await this.userRepository.verifyPassword(user, password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  /**
   * Login user
   */
  async login(user: User): Promise<AuthResponseDto> {
    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    const tokens = await this.generateTokens(user);

    return {
      ...tokens,
      user: this.excludePassword(user),
    };
  }

  /**
   * Find user by ID
   */
  async findUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  /**
   * Find user by email
   */
  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  /**
   * Get user profile
   */
  async getProfile(userId: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.excludePassword(user);
  }

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    updateData: {
      firstName?: string;
      lastName?: string;
      avatar?: string;
    },
  ): Promise<UserResponseDto> {
    const user = await this.userRepository.updateUser(userId, updateData);
    return this.excludePassword(user);
  }

  /**
   * Change user password
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await this.userRepository.verifyPassword(
      user,
      currentPassword,
    );
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Update password
    await this.userRepository.updatePassword(userId, newPassword);
  }

  /**
   * Refresh JWT token
   */
  async refreshToken(userId: string): Promise<{ accessToken: string; expiresIn: number }> {
    const user = await this.userRepository.findById(userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    const payload: JwtPayload = { sub: user.id, email: user.email };
    const expiresIn = 3600; // 1 hour

    return {
      accessToken: this.jwtService.sign(payload, { expiresIn }),
      expiresIn,
    };
  }

  /**
   * Logout user (in a real implementation, you might want to blacklist the token)
   */
  async logout(userId: string): Promise<void> {
    // In a production environment, you might want to:
    // 1. Add the token to a blacklist
    // 2. Store logout timestamp in the database
    // 3. Invalidate refresh tokens
    
    // For now, we'll just validate that the user exists
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
  }

  /**
   * Deactivate user account
   */
  async deactivateAccount(userId: string): Promise<void> {
    await this.userRepository.toggleUserStatus(userId, false);
  }

  /**
   * Reactivate user account
   */
  async reactivateAccount(userId: string): Promise<void> {
    await this.userRepository.toggleUserStatus(userId, true);
  }

  /**
   * Generate JWT access and refresh tokens
   */
  private async generateTokens(user: User): Promise<{
    accessToken: string;
    refreshToken?: string;
    expiresIn: number;
  }> {
    const payload: JwtPayload = { sub: user.id, email: user.email };
    const expiresIn = 3600; // 1 hour

    const accessToken = this.jwtService.sign(payload, { expiresIn });

    // You can implement refresh token logic here if needed
    // const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      accessToken,
      // refreshToken,
      expiresIn,
    };
  }

  /**
   * Remove password from user object and conditionally add isAdmin field
   */
  private excludePassword(user: User & { userType?: { name: string } | null }): UserResponseDto {
    const { password, userType, userTypeId, ...userWithoutPassword } = user;
    const isAdmin = this.userRepository.isAdmin(user);
    
    const result: UserResponseDto = {
      ...userWithoutPassword,
    };
    
    // Only include isAdmin field if user is actually an admin
    if (isAdmin) {
      result.isAdmin = true;
    }
    
    return result;
  }

  /**
   * Verify JWT token
   */
  async verifyToken(token: string): Promise<JwtPayload> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  /**
   * Handle Google OAuth login/register
   */
  async googleLogin(googleUser: {
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  }): Promise<AuthResponseDto> {
    // Check if user already exists
    let user = await this.userRepository.findByEmail(googleUser.email);

    if (!user) {
      // Create new user with Google profile data
      user = await this.userRepository.createUser({
        email: googleUser.email,
        password: null, // Google OAuth users don't have passwords
        firstName: googleUser.firstName,
        lastName: googleUser.lastName,
        avatar: googleUser.avatar,
      });
    } else if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    // Generate JWT tokens
    const tokens = await this.generateTokens(user);

    return {
      ...tokens,
      user: this.excludePassword(user),
    };
  }

  /**
   * Promote user to admin
   */
  async promoteToAdmin(userId: string): Promise<UserResponseDto> {
    const user = await this.userRepository.setUserAsAdmin(userId);
    return this.excludePassword(user);
  }
}
