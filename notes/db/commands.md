# Database Commands Quick Reference

## NPM Scripts (Recommended)
```bash
npm run db:generate    # Generate Prisma client
npm run db:migrate     # Run database migrations  
npm run db:reset       # Reset database (DANGEROUS)
npm run db:studio      # Open Prisma Studio GUI
npm run db:test        # Test database connection
```

## Direct Prisma Commands
```bash
# Client Generation
npx prisma generate --schema=./src/database/prisma/schema.prisma

# Migrations
npx prisma migrate dev --schema=./src/database/prisma/schema.prisma
npx prisma migrate deploy --schema=./src/database/prisma/schema.prisma
npx prisma migrate status --schema=./src/database/prisma/schema.prisma

# Database Operations
npx prisma db pull --schema=./src/database/prisma/schema.prisma
npx prisma db push --schema=./src/database/prisma/schema.prisma

# Utilities
npx prisma format --schema=./src/database/prisma/schema.prisma
npx prisma studio --schema=./src/database/prisma/schema.prisma
```

## MySQL Commands
```bash
# Connect to MySQL
mysql -u root -p

# Show databases
SHOW DATABASES;

# Use wishin database
USE wishin;

# Show tables
SHOW TABLES;

# Describe table structure
DESCRIBE users;
DESCRIBE accounts;
```

## Troubleshooting Commands
```bash
# Check connection
npm run db:test

# Reset and recreate
npm run db:reset --force

# Check migration status
npx prisma migrate status --schema=./src/database/prisma/schema.prisma

# Format schema
npx prisma format --schema=./src/database/prisma/schema.prisma
```

<!-- 
const birthdayEvent = {
  title: "John's Birthday",
  eventDate: new Date("2024-03-15"),
  eventType: "BIRTHDAY",
  personName: "John Doe",
  description: "Don't forget to buy a gift!",
  recurringEvent: true,
  reminders: [
    {
      reminderDays: 7,  // 1 week before
      notificationTypes: ["EMAIL", "PUSH_NOTIFICATION"]
    },
    {
      reminderDays: 1,  // 1 day before  
      notificationTypes: ["SMS", "CALL"]
    },
    {
      reminderDays: 30, // 1 month before
      notificationTypes: ["EMAIL"]
    }
  ]
} -->