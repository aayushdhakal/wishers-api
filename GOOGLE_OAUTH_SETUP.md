# Google OAuth Implementation

## Overview
Google OAuth has been successfully implemented in your Wishin API project. This implementation allows users to authenticate using their Google accounts.

## Files Created/Modified

### New Files:
- `src/modules/auth/strategies/google.strategy.ts` - Google OAuth strategy
- `src/modules/auth/guards/google-auth.guard.ts` - Google OAuth guard

### Modified Files:
- `src/modules/auth/strategies/index.ts` - Added Google strategy export
- `src/modules/auth/guards/index.ts` - Added Google guard export
- `src/services/auth/auth.service.ts` - Added `googleLogin()` method
- `src/modules/auth/controllers/auth.controller.ts` - Added Google OAuth routes
- `src/modules/auth/auth.module.ts` - Added Google strategy and guard providers
- `package.json` - Added Google OAuth dependencies

## API Endpoints

### 1. Initiate Google OAuth Flow
```
GET /api/v1/auth/google
```
This endpoint redirects users to Google's OAuth consent screen.

### 2. Google OAuth Callback (Redirect)
```
GET /api/v1/auth/google/callback
```
This endpoint handles the callback from Google and redirects to your frontend with the token.

### 3. Google OAuth Callback (JSON)
```
GET /api/v1/auth/google/callback/json
```
Alternative endpoint that returns JSON response directly (for API clients).

**Response:**
```json
{
  "accessToken": "jwt_token_here",
  "expiresIn": 3600,
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": "https://profile_image_url",
    "isActive": true,
    "createdAt": "2023-...",
    "updatedAt": "2023-..."
  }
}
```

## Environment Variables Required

Add these environment variables to your `.env` file:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=https://localhost:3443/api/v1/auth/google/callback
```

## Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Configure OAuth consent screen
6. Set authorized redirect URIs:
   - Development: `https://localhost:3443/api/v1/auth/google/callback`
   - Production: `https://yourdomain.com/api/v1/auth/google/callback`

## How It Works

### Standard Flow (with Frontend Redirect):
1. **User clicks "Login with Google"** → Frontend redirects to `GET /api/v1/auth/google`
2. **OAuth Flow Initiated** → User is redirected to Google's consent screen
3. **User Grants Permission** → Google redirects back to `/api/v1/auth/google/callback`
4. **Account Creation/Login** → 
   - If user doesn't exist: New account is created with Google profile data
   - If user exists: Existing account is used for login
5. **Frontend Redirect** → User is redirected to `{FRONTEND_URL}/auth/callback` with token parameters

### API Client Flow (JSON Response):
- Use `/api/v1/auth/google/callback/json` in your Google Cloud Console instead
- Returns JSON response directly without redirect

## Frontend Integration Example

### Standard Flow (Recommended):
```javascript
// 1. Redirect to Google OAuth
window.location.href = 'http://localhost:3000/api/v1/auth/google';

// 2. Handle callback on your frontend route `/auth/callback`
// Example: React Router component
function AuthCallback() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const user = JSON.parse(urlParams.get('user') || '{}');
    
    if (token) {
      // Store JWT token
      localStorage.setItem('accessToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Redirect to dashboard
      window.location.href = '/dashboard';
    }
  }, []);
  
  return <div>Processing login...</div>;
}

// 3. Handle errors on `/auth/error`
function AuthError() {
  const urlParams = new URLSearchParams(window.location.search);
  const error = urlParams.get('error');
  const message = urlParams.get('message');
  
  return <div>Login failed: {message}</div>;
}
```

### API Client Flow:
```javascript
// For API clients that prefer JSON response
// Configure Google Console to use: /api/v1/auth/google/callback/json
fetch('http://localhost:3000/api/v1/auth/google/callback/json')
  .then(response => response.json())
  .then(data => {
    localStorage.setItem('accessToken', data.accessToken);
  });
```

## Security Features

- Uses secure OAuth 2.0 flow
- JWT tokens for session management
- Automatic user creation with Google profile data
- Account status validation (active/inactive users)
- Proper error handling for unauthorized access

## Notes

- Users created via Google OAuth will have `password: null` in the database
- The implementation automatically creates new users if they don't exist
- Existing users can link their Google account by using the same email
- The callback URL must match exactly what's configured in Google Cloud Console
