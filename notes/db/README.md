# Database Notes & Commands

## Overview
This project uses **MySQL** database with **Prisma ORM** for database operations and migrations.

## Database Configuration

### Connection String
```env
DATABASE_URL="mysql://root:root@localhost:3306/wishin?allowPublicKeyRetrieval=true&useSSL=false"
```

### Database Details
- **Database Type:** MySQL
- **Database Name:** wishin
- **Host:** localhost
- **Port:** 3306
- **Username:** root
- **Password:** root

## Prisma Commands

### Core Commands
```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Reset database (DANGEROUS - deletes all data)
npm run db:reset

# Open Prisma Studio (GUI)
npm run db:studio

# Test database connection
npm run db:test
```

### Direct Prisma Commands
```bash
# Generate client
npx prisma generate --schema=./src/database/prisma/schema.prisma

# Create and apply migration
npx prisma migrate dev --schema=./src/database/prisma/schema.prisma

# Apply existing migrations
npx prisma migrate deploy --schema=./src/database/prisma/schema.prisma

# Check migration status
npx prisma migrate status --schema=./src/database/prisma/schema.prisma

# Format schema file
npx prisma format --schema=./src/database/prisma/schema.prisma

# Introspect existing database
npx prisma db pull --schema=./src/database/prisma/schema.prisma

# Push schema changes without migration
npx prisma db push --schema=./src/database/prisma/schema.prisma
```

## Current Database Schema

### Tables
1. **users** - Main user table
2. **accounts** - OAuth provider accounts linked to users

### User Table Structure
```sql
users (
  id VARCHAR(191) PRIMARY KEY,
  email VARCHAR(191) UNIQUE NOT NULL,
  password VARCHAR(191) NULL,
  firstName VARCHAR(191) NULL,
  lastName VARCHAR(191) NULL,
  avatar VARCHAR(191) NULL,
  isActive BOOLEAN DEFAULT true,
  createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL
)
```

### Account Table Structure
```sql
accounts (
  id VARCHAR(191) PRIMARY KEY,
  userId VARCHAR(191) NOT NULL,
  provider ENUM('LOCAL', 'GOOGLE', 'FACEBOOK'),
  providerAccountId VARCHAR(191) NOT NULL,
  accessToken VARCHAR(191) NULL,
  refreshToken VARCHAR(191) NULL,
  expiresAt DATETIME(3) NULL,
  tokenType VARCHAR(191) NULL,
  scope VARCHAR(191) NULL,
  idToken VARCHAR(191) NULL,
  sessionState VARCHAR(191) NULL,
  createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL,
  
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY (provider, providerAccountId)
)
```

## File Locations

### Important Files
- **Schema:** `src/database/prisma/schema.prisma`
- **Generated Client:** `src/database/prisma/generated/`
- **Migrations:** `src/database/prisma/migrations/`
- **Prisma Service:** `src/database/prisma.service.ts`
- **User Repository:** `src/database/repositories/user.repository.ts`

## Common Operations

### Creating a New Migration
1. Modify `src/database/prisma/schema.prisma`
2. Run `npm run db:migrate`
3. Enter migration name when prompted
4. Migration files are created in `src/database/prisma/migrations/`

### Adding a New Model
1. Add model to `schema.prisma`
2. Run `npm run db:generate` to update client
3. Run `npm run db:migrate` to create migration
4. Create repository file in `src/database/repositories/`

### Troubleshooting

#### Migration Issues
- Check database connection with `npm run db:test`
- Verify DATABASE_URL in `.env` file
- Ensure MySQL server is running
- Check migration status with `npx prisma migrate status`

#### Connection Issues
- Verify MySQL server is running (XAMPP/WAMP)
- Check database exists: `wishin`
- Verify credentials in DATABASE_URL
- Check firewall settings for port 3306

## Environment Setup

### Required Environment Variables
```env
DATABASE_URL="mysql://root:root@localhost:3306/wishin?allowPublicKeyRetrieval=true&useSSL=false"
```

### MySQL Setup (XAMPP/WAMP)
1. Start Apache and MySQL services
2. Open phpMyAdmin
3. Create database named `wishin`
4. Update DATABASE_URL if needed
5. Run `npm run db:migrate`
