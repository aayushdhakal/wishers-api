# Auth Module

This module provides comprehensive authentication and authorization functionality for the Wishin API using NestJS, Passport, and JWT tokens.

## Features

- User registration and login
- JWT-based authentication
- Local strategy (email/password)
- Password hashing with bcrypt
- User profile management
- Account deactivation/reactivation
- Password change functionality
- Protected routes with JWT guards
- Public route decorator

## Structure

```
src/modules/auth/
├── controllers/
│   ├── auth.controller.ts      # Authentication endpoints
│   └── index.ts
├── services/
│   ├── auth.service.ts         # Core authentication logic
│   └── index.ts
├── strategies/
│   ├── local.strategy.ts       # Passport local strategy
│   ├── jwt.strategy.ts         # Passport JWT strategy
│   └── index.ts
├── guards/
│   ├── local-auth.guard.ts     # Local authentication guard
│   ├── jwt-auth.guard.ts       # JWT authentication guard
│   └── index.ts
├── dto/
│   ├── login.dto.ts            # Login request validation
│   ├── register.dto.ts         # Registration request validation
│   ├── auth-response.dto.ts    # Authentication response types
│   └── index.ts
├── decorators/
│   ├── public.decorator.ts     # Mark routes as public
│   ├── current-user.decorator.ts # Extract current user from request
│   └── index.ts
├── auth.module.ts              # Main auth module
├── index.ts                    # Module exports
└── README.md                   # This file
```

## API Endpoints

### Public Endpoints

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login with email and password

### Protected Endpoints

- `GET /auth/profile` - Get current user profile
- `PUT /auth/profile` - Update user profile
- `GET /auth/me` - Get minimal current user info
- `POST /auth/change-password` - Change user password
- `POST /auth/refresh` - Refresh JWT token
- `POST /auth/logout` - Logout user
- `POST /auth/deactivate` - Deactivate user account
- `POST /auth/reactivate` - Reactivate user account

## Usage Examples

### Register a new user

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123"
  }'
```

### Access protected endpoint

```bash
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Environment Variables

Make sure to set these environment variables:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=1h
```

## Security Features

1. **Password Hashing**: Uses bcrypt with salt rounds of 12
2. **JWT Tokens**: Secure token-based authentication
3. **Input Validation**: DTOs with class-validator decorators
4. **Global Guards**: JWT guard applied globally with public route exceptions
5. **User Status Check**: Inactive users cannot authenticate
6. **Token Expiration**: Configurable token expiration times

## Integration

The auth module is automatically integrated into the main application:

1. **Global JWT Guard**: Applied to all routes by default
2. **Public Routes**: Use `@Public()` decorator to bypass authentication
3. **Current User**: Use `@CurrentUser()` decorator to get authenticated user
4. **Database Integration**: Uses existing UserRepository for data operations

## Extending the Module

### Adding OAuth Providers

The existing UserRepository already supports OAuth accounts. To add OAuth providers:

1. Create new strategy files (e.g., `google.strategy.ts`)
2. Add provider-specific DTOs
3. Extend AuthService with OAuth methods
4. Add new controller endpoints

### Adding Role-Based Authorization

To add role-based access control:

1. Create role decorators and guards
2. Extend JWT payload with user roles
3. Add role checking in guards
4. Update user model to include roles

### Adding Refresh Tokens

To implement refresh token functionality:

1. Store refresh tokens in database
2. Add refresh token generation to AuthService
3. Create refresh token validation
4. Add token blacklisting for logout

## Best Practices Implemented

1. **Separation of Concerns**: Clear separation between controllers, services, and strategies
2. **Dependency Injection**: Proper use of NestJS DI container
3. **Error Handling**: Comprehensive error handling with appropriate HTTP status codes
4. **Validation**: Input validation using DTOs and class-validator
5. **Security**: Password hashing, JWT tokens, and secure defaults
6. **Modularity**: Self-contained module with clear exports
7. **Documentation**: Comprehensive inline documentation and README
8. **Type Safety**: Full TypeScript support with proper typing

## Testing

To test the auth module:

```bash
# Start the application
npm run start:dev

# Test registration
curl -X POST http://localhost:3000/auth/register -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User"}'

# Test login
curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"password123"}'

# Test protected route (use token from login response)
curl -X GET http://localhost:3000/auth/profile -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Dependencies

- `@nestjs/passport` - Passport integration
- `@nestjs/jwt` - JWT token handling
- `passport-local` - Local authentication strategy
- `passport-jwt` - JWT authentication strategy
- `class-validator` - Input validation
- `class-transformer` - Data transformation
- `bcryptjs` - Password hashing

All dependencies are already installed and configured.
