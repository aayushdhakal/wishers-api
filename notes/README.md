# Wishin API - Development Notes

## Overview
This folder contains comprehensive documentation and command references for the Wishin API project.

## Folder Structure

### 📁 [Database Notes](./db/README.md)
- MySQL & Prisma ORM documentation
- Database commands and migrations
- Schema information and troubleshooting

### 📁 [NestJS Notes](./nest/README.md)
- NestJS framework documentation
- CLI commands and project structure
- Development and testing commands

### 📁 [Authentication Notes](./auth/README.md)
- Authentication system documentation
- OAuth setup instructions
- Security considerations and implementation plans

## Quick Command Reference

### Development Commands
```bash
# Start development server
npm run start:dev

# Database operations
npm run db:generate    # Generate Prisma client
npm run db:migrate     # Run migrations
npm run db:test        # Test connection

# Testing
npm test              # Run unit tests
npm run test:e2e      # Run e2e tests
```

### Project Status

#### ✅ Completed
- [x] MySQL database setup
- [x] Prisma ORM configuration
- [x] User and Account models
- [x] Database migrations
- [x] User repository with CRUD operations
- [x] Password hashing with bcryptjs
- [x] Multi-provider OAuth support (schema)

#### 🔄 In Progress / To Do
- [ ] Authentication controllers
- [ ] Authentication services  
- [ ] Passport strategies (Local, Google, Facebook)
- [ ] JWT token management
- [ ] Route guards and middleware
- [ ] API documentation

## Environment Setup

### Required Environment Variables
```env
# Database
DATABASE_URL="mysql://root:root@localhost:3306/wishin?allowPublicKeyRetrieval=true&useSSL=false"

# JWT
JWT_SECRET="your-jwt-secret"
JWT_EXPIRES_IN="7d"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Facebook OAuth  
FACEBOOK_APP_ID="your-facebook-app-id"
FACEBOOK_APP_SECRET="your-facebook-app-secret"
```

## File Locations

### Important Files
- **Main App:** `src/app.module.ts`
- **Database:** `src/database/`
- **Prisma Schema:** `src/database/prisma/schema.prisma`
- **Environment:** `.env`
- **Documentation:** `notes/`

## Getting Started

1. **Setup Database:**
   ```bash
   # Start MySQL (XAMPP/WAMP)
   # Create 'wishin' database
   npm run db:migrate
   ```

2. **Start Development:**
   ```bash
   npm run start:dev
   ```

3. **Test Database:**
   ```bash
   npm run db:test
   ```

## Useful Links

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Passport.js Documentation](http://www.passportjs.org/docs/)

## Notes Organization

Each folder contains:
- **README.md** - Comprehensive documentation
- **Commands** - Quick reference commands
- **Examples** - Code examples and snippets
- **Troubleshooting** - Common issues and solutions

---

**Last Updated:** September 21, 2025  
**Project:** Wishin API  
**Framework:** NestJS + MySQL + Prisma
