import { CanActivate, ExecutionContext } from '@nestjs/common';
import { UserRepository } from '../../../database/repositories/user.repository';
export declare class AdminGuard implements CanActivate {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
