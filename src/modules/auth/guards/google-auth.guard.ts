import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  getAuthenticateOptions(context: ExecutionContext) {
    // Force account selection to prevent automatic login
    // This ensures users always see the account selection screen
    return {
      prompt: 'select_account',
    };
  }
}
