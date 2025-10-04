import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserRepository } from '../../../database/repositories/user.repository';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly userRepository: UserRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Fetch user with userType to check admin status
    const fullUser = await this.userRepository.findById(user.id);

    if (!fullUser || !this.userRepository.isAdmin(fullUser)) {
      throw new ForbiddenException('Admin access required');
    }

    return true;
  }
}
