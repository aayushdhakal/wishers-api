# Authentication Commands Quick Reference

## Setup Commands (To Be Run)
```bash
# Install authentication packages
npm install @nestjs/passport passport
npm install @nestjs/jwt passport-jwt  
npm install passport-local passport-google-oauth20 passport-facebook

# Install TypeScript types
npm install --save-dev @types/passport-local @types/passport-jwt
npm install --save-dev @types/passport-google-oauth20 @types/passport-facebook

# Install configuration package
npm install @nestjs/config
```

## Generate Auth Structure (Future)
```bash
# Generate auth module and components
nest g mo auth
nest g co auth
nest g s auth

# Generate strategies
nest g s auth/strategies/local
nest g s auth/strategies/jwt
nest g s auth/strategies/google
nest g s auth/strategies/facebook

# Generate guards
nest g gu auth/guards/jwt-auth
nest g gu auth/guards/local-auth
nest g gu auth/guards/roles

# Generate DTOs
mkdir src/auth/dto
# Create manually: login.dto.ts, register.dto.ts, auth-response.dto.ts
```

## Testing Commands (Future Implementation)
```bash
# Test user registration
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User"}'

# Test user login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test protected route
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer <jwt-token>"

# Test Google OAuth
curl -X GET http://localhost:3000/auth/google

# Test Facebook OAuth  
curl -X GET http://localhost:3000/auth/facebook
```

## Database User Operations (Available Now)
```bash
# Test database connection
npm run db:test

# Open Prisma Studio to view users
npm run db:studio
```

## Repository Testing (Available Now)
```javascript
// In Node.js REPL or test file
const { PrismaClient } = require('./src/database/prisma/generated');
const { UserRepository } = require('./src/database/repositories/user.repository');

const prisma = new PrismaClient();
const userRepo = new UserRepository(prisma);

// Create test user
await userRepo.createUser({
  email: 'test@example.com',
  password: 'password123',
  firstName: 'Test',
  lastName: 'User'
});

// Find user by email
const user = await userRepo.findByEmail('test@example.com');
console.log(user);
```

## Environment Variable Commands
```bash
# Check environment variables are loaded
node -e "require('dotenv').config(); console.log(process.env.DATABASE_URL);"

# Validate OAuth credentials (when implemented)
node -e "console.log('Google:', !!process.env.GOOGLE_CLIENT_ID);"
node -e "console.log('Facebook:', !!process.env.FACEBOOK_APP_ID);"
```

## OAuth Provider Setup Commands

### Google OAuth Setup
```bash
# 1. Go to Google Cloud Console
open https://console.cloud.google.com/

# 2. Enable APIs
# - Google+ API
# - Google OAuth2 API

# 3. Create OAuth 2.0 credentials
# - Application type: Web application
# - Authorized redirect URIs: http://localhost:3000/auth/google/callback
```

### Facebook OAuth Setup  
```bash
# 1. Go to Facebook Developers
open https://developers.facebook.com/

# 2. Create new app
# 3. Add Facebook Login product
# 4. Configure Valid OAuth Redirect URIs: 
#    http://localhost:3000/auth/facebook/callback
```

## JWT Token Commands (Future)
```bash
# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Decode JWT token (for debugging)
node -e "
const token = 'your-jwt-token-here';
const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64'));
console.log(payload);
"
```

## Security Testing Commands (Future)
```bash
# Test password hashing
node -e "
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('password123', 12);
console.log('Hash:', hash);
console.log('Valid:', bcrypt.compareSync('password123', hash));
"

# Test JWT generation
node -e "
const jwt = require('jsonwebtoken');
const token = jwt.sign({userId: '123', email: 'test@example.com'}, 'secret');
console.log('Token:', token);
console.log('Decoded:', jwt.verify(token, 'secret'));
"
```

## Development Workflow
```bash
# 1. Ensure database is running
npm run db:test

# 2. Start development server
npm run start:dev

# 3. Test authentication endpoints (when implemented)
# Use Postman, curl, or frontend application

# 4. Monitor logs for authentication events
# Check console output from npm run start:dev
```
