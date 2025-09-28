# Environment Variables Configuration

Create a `.env` file in the root directory with the following variables:

## Database Configuration
```env
DATABASE_URL="mysql://username:password@localhost:3306/wishin?allowPublicKeyRetrieval=true&useSSL=false"
```

## JWT Configuration
```env
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"
```

## Google OAuth Configuration
```env
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3000/auth/google/callback"
```

## Facebook OAuth Configuration
```env
FACEBOOK_APP_ID="your-facebook-app-id"
FACEBOOK_APP_SECRET="your-facebook-app-secret"
FACEBOOK_CALLBACK_URL="http://localhost:3000/auth/facebook/callback"
```

## Application Configuration
```env
PORT=3000
NODE_ENV="development"
```

## Frontend URL (for CORS and redirects)
```env
FRONTEND_URL="http://localhost:3001"
```

## Session Secret (for passport sessions if needed)
```env
SESSION_SECRET="your-session-secret-key"
```

## How to get OAuth Credentials:

### Google OAuth Setup:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client IDs
5. Set application type to "Web application"
6. Add authorized redirect URIs: `http://localhost:3000/auth/google/callback`
7. Copy Client ID and Client Secret

### Facebook OAuth Setup:
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. In Facebook Login settings, add Valid OAuth Redirect URIs: `http://localhost:3000/auth/facebook/callback`
5. Copy App ID and App Secret from Basic Settings

## Database Setup:
1. Install MySQL locally or use a cloud provider (XAMPP, WAMP, or standalone MySQL)
2. Create a database named `wishin`
3. Update the DATABASE_URL with your MySQL credentials
4. Run `npm run db:migrate` to create tables

## Prisma Commands:
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:reset` - Reset database
- `npm run db:studio` - Open Prisma Studio

Note: Prisma schema is now located at `src/database/prisma/schema.prisma`
