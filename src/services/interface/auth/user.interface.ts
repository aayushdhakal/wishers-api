import { AuthProvider } from "@prisma/client";

export interface CreateUserData {
    email: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
  }
  
  export interface CreateOAuthUserData {
    email: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    provider: AuthProvider;
    providerAccountId: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: Date;
    tokenType?: string;
    scope?: string;
    idToken?: string;
  }
  
  export interface UpdateUserData {
    email?: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    isActive?: boolean;
  }