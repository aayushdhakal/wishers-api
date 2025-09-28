# Authentication Notes & Commands

## Overview
Authentication system supporting multiple login methods:
- **Email/Password** (Local Strategy)
- **Google OAuth**
- **Facebook OAuth**

## Current Implementation Status

### ✅ Completed
- Database schema with User and Account models
- UserRepository with all CRUD operations
- Password hashing with bcryptjs
- Multi-provider account linking
- Database migrations applied

### 🔄 To Be Implemented
- Authentication controllers
- Authentication services
- Passport strategies
- JWT token management
- Route guards

## Database Schema

### User Model
```typescript
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String?  // Optional for OAuth users
  firstName String?
  lastName  String?
  avatar    String?
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  accounts  Account[]
}
```

### Account Model (OAuth)
```typescript
model Account {
  id                String      @id @default(cuid())
  userId            String
  provider          AuthProvider // LOCAL, GOOGLE, FACEBOOK
  providerAccountId String
  accessToken       String?
  refreshToken      String?
  expiresAt         DateTime?
  tokenType         String?
  scope             String?
  idToken           String?
  sessionState      String?
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt
  user              User        @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## Repository Functions Available

### User Management
```typescript
// Create new user with email/password
createUser(data: CreateUserData): Promise<User>

// Create user with OAuth
createOAuthUser(data: CreateOAuthUserData): Promise<User>

// Find users
findByEmail(email: string): Promise<User | null>
findById(id: string): Promise<User | null>
findByProvider(provider: AuthProvider, providerAccountId: string): Promise<User | null>

// Update operations
updateUser(id: string, data: UpdateUserData): Promise<User>
updatePassword(id: string, newPassword: string): Promise<User>

// Password verification
verifyPassword(user: User, password: string): Promise<boolean>

// OAuth account management
linkOAuthAccount(userId: string, provider: AuthProvider, ...): Promise<Account>
updateOAuthTokens(provider: AuthProvider, providerAccountId: string, tokens: {...}): Promise<Account>
```

## Environment Variables Required

### JWT Configuration
```env
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"
```

### Google OAuth
```env
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3000/auth/google/callback"
```

### Facebook OAuth
```env
FACEBOOK_APP_ID="your-facebook-app-id"
FACEBOOK_APP_SECRET="your-facebook-app-secret"
FACEBOOK_CALLBACK_URL="http://localhost:3000/auth/facebook/callback"
```

### Application
```env
SESSION_SECRET="your-session-secret-key"
FRONTEND_URL="http://localhost:3001"
```

## OAuth Provider Setup

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 Client ID credentials
5. Set authorized redirect URI: `http://localhost:3000/auth/google/callback`
6. Copy Client ID and Client Secret to `.env`

### Facebook OAuth Setup
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create new app
3. Add Facebook Login product
4. Set Valid OAuth Redirect URI: `http://localhost:3000/auth/facebook/callback`
5. Copy App ID and App Secret to `.env`

## Future Implementation Plan

### 1. Install Required Packages
```bash
# Authentication packages
npm install @nestjs/passport passport
npm install @nestjs/jwt passport-jwt
npm install passport-local passport-google-oauth20 passport-facebook

# TypeScript types
npm install --save-dev @types/passport-local @types/passport-jwt
npm install --save-dev @types/passport-google-oauth20 @types/passport-facebook

# Additional utilities
npm install @nestjs/config
```

### 2. Create Auth Module Structure
```
src/auth/
├── auth.module.ts
├── auth.controller.ts
├── auth.service.ts
├── strategies/
│   ├── local.strategy.ts
│   ├── google.strategy.ts
│   ├── facebook.strategy.ts
│   └── jwt.strategy.ts
├── guards/
│   ├── jwt-auth.guard.ts
│   ├── local-auth.guard.ts
│   └── roles.guard.ts
├── dto/
│   ├── login.dto.ts
│   ├── register.dto.ts
│   └── auth-response.dto.ts
└── interfaces/
    └── jwt-payload.interface.ts
```

### 3. Authentication Endpoints
```typescript
// Local authentication
POST /auth/register
POST /auth/login

// OAuth authentication
GET /auth/google
GET /auth/google/callback
GET /auth/facebook
GET /auth/facebook/callback

// Token management
POST /auth/refresh
POST /auth/logout

// User profile
GET /auth/profile
PUT /auth/profile
```

## Security Considerations

### Password Security
- ✅ Passwords hashed with bcryptjs (salt rounds: 12)
- ✅ Optional passwords for OAuth-only users
- 🔄 Password strength validation (to implement)
- 🔄 Password reset functionality (to implement)

### JWT Security
- 🔄 Short-lived access tokens (15-30 minutes)
- 🔄 Long-lived refresh tokens (7 days)
- 🔄 Token blacklisting for logout
- 🔄 Secure HTTP-only cookies for tokens

### OAuth Security
- ✅ Secure callback URLs configured
- 🔄 State parameter for CSRF protection
- 🔄 Token validation and refresh
- 🔄 Account linking with existing users

## Authentication Flow

### Local Authentication Flow
1. User submits email/password
2. Validate credentials against database
3. Generate JWT tokens
4. Return tokens to client
5. Client includes token in subsequent requests

### OAuth Flow
1. User clicks OAuth provider login
2. Redirect to provider authorization
3. Provider redirects back with authorization code
4. Exchange code for access token
5. Fetch user profile from provider
6. Create/link user account in database
7. Generate JWT tokens
8. Return tokens to client

### Token Refresh Flow
1. Access token expires
2. Client sends refresh token
3. Validate refresh token
4. Generate new access token
5. Return new token to client

## Common Commands (Future)

### Authentication Testing
```bash
# Register new user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login user
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Access protected route
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer <jwt-token>"
```

### OAuth Testing
```bash
# Google OAuth
curl http://localhost:3000/auth/google

# Facebook OAuth
curl http://localhost:3000/auth/facebook
```

## Error Handling

### Common Auth Errors
- `401 Unauthorized` - Invalid credentials
- `403 Forbidden` - Valid token but insufficient permissions
- `409 Conflict` - Email already exists during registration
- `422 Unprocessable Entity` - Invalid input data

### Error Response Format
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

## Testing Strategy

### Unit Tests
- Repository functions ✅
- Authentication service (to implement)
- Password hashing/verification (to implement)
- JWT token generation/validation (to implement)

### Integration Tests
- Authentication endpoints (to implement)
- OAuth flows (to implement)
- Protected route access (to implement)

### E2E Tests
- Complete authentication flows (to implement)
- Cross-browser OAuth testing (to implement)
