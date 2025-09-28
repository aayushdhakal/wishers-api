# NestJS Notes & Commands

## Overview
This project is built with **NestJS** - a progressive Node.js framework for building efficient and scalable server-side applications.

## Project Structure

### Current Structure
```
src/
├── app.controller.ts      # Main app controller
├── app.module.ts         # Root module
├── app.service.ts        # Main app service
├── main.ts              # Application entry point
└── database/            # Database layer
    ├── prisma/
    ├── repositories/
    ├── prisma.service.ts
    ├── database.module.ts
    └── index.ts
```

## NestJS Commands

### Development Commands
```bash
# Start development server with hot reload
npm run start:dev

# Start development server with debug mode
npm run start:debug

# Build the application
npm run build

# Start production server
npm run start:prod

# Format code
npm run format

# Lint code
npm run lint
```

### Testing Commands
```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e

# Debug tests
npm run test:debug
```

### NestJS CLI Commands
```bash
# Generate a new controller
nest generate controller <name>
nest g co <name>

# Generate a new service
nest generate service <name>
nest g s <name>

# Generate a new module
nest generate module <name>
nest g mo <name>

# Generate a new guard
nest generate guard <name>
nest g gu <name>

# Generate a new interceptor
nest generate interceptor <name>
nest g in <name>

# Generate a new pipe
nest generate pipe <name>
nest g pi <name>

# Generate a new decorator
nest generate decorator <name>
nest g d <name>

# Generate a new middleware
nest generate middleware <name>
nest g mi <name>

# Generate a complete resource (CRUD)
nest generate resource <name>
nest g res <name>
```

## Core Concepts

### Modules
- **Purpose:** Organize application into cohesive blocks
- **Root Module:** `AppModule` in `src/app.module.ts`
- **Feature Modules:** Group related functionality

### Controllers
- **Purpose:** Handle incoming requests and return responses
- **Decorators:** `@Controller()`, `@Get()`, `@Post()`, etc.
- **Example:** `src/app.controller.ts`

### Services/Providers
- **Purpose:** Handle business logic and data access
- **Decorators:** `@Injectable()`
- **Example:** `src/app.service.ts`

### Dependency Injection
- NestJS uses dependency injection container
- Services are injected into controllers/other services
- Use `@Injectable()` decorator for services

## Common Decorators

### Controller Decorators
```typescript
@Controller('users')           // Route prefix
@Get()                        // HTTP GET
@Post()                       // HTTP POST
@Put()                        // HTTP PUT
@Delete()                     // HTTP DELETE
@Patch()                      // HTTP PATCH
@Param('id')                  // Route parameter
@Query()                      // Query parameters
@Body()                       // Request body
@Headers()                    // Request headers
```

### Service Decorators
```typescript
@Injectable()                 // Makes class injectable
@Inject()                     // Inject specific token
```

### Module Decorators
```typescript
@Module({
  imports: [],               // Other modules
  controllers: [],           // Controllers
  providers: [],            // Services/providers
  exports: []               // Export providers
})
```

## Authentication Setup (Future)

### Recommended Structure
```
src/
├── auth/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── strategies/
│   │   ├── local.strategy.ts
│   │   ├── google.strategy.ts
│   │   └── facebook.strategy.ts
│   ├── guards/
│   │   └── jwt-auth.guard.ts
│   └── dto/
│       ├── login.dto.ts
│       └── register.dto.ts
```

### Required Packages for Auth
```bash
npm install @nestjs/passport passport
npm install @nestjs/jwt passport-jwt
npm install passport-local passport-google-oauth20 passport-facebook
npm install @types/passport-local @types/passport-jwt
npm install @types/passport-google-oauth20 @types/passport-facebook
```

## Environment Configuration

### Environment Files
- `.env` - Development environment
- `.env.production` - Production environment
- `.env.local` - Local overrides

### Configuration Module
```bash
npm install @nestjs/config
```

## Middleware & Guards

### Global Middleware
```typescript
// In main.ts
app.use(middleware);
```

### Route Guards
```typescript
@UseGuards(AuthGuard)
@Get('protected')
getProtected() {
  return 'This is protected';
}
```

## Error Handling

### Built-in Exceptions
```typescript
throw new BadRequestException('Invalid input');
throw new UnauthorizedException('Access denied');
throw new ForbiddenException('Forbidden resource');
throw new NotFoundException('Resource not found');
throw new InternalServerErrorException('Server error');
```

### Custom Exception Filters
```typescript
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // Handle exception
  }
}
```

## Validation & Pipes

### Class Validator
```bash
npm install class-validator class-transformer
```

### Validation Pipes
```typescript
@UsePipes(new ValidationPipe())
@Post()
create(@Body() createDto: CreateDto) {
  return this.service.create(createDto);
}
```

## Development Tips

### Hot Reload
- Use `npm run start:dev` for development
- Changes are automatically reflected
- No need to restart server manually

### Debugging
- Use `npm run start:debug` for debugging
- Attach debugger to port 9229
- Set breakpoints in your IDE

### Testing
- Unit tests: `*.spec.ts` files
- E2E tests: `test/` directory
- Use Jest testing framework

## File Naming Conventions

### Controllers
- `user.controller.ts`
- `auth.controller.ts`

### Services
- `user.service.ts`
- `auth.service.ts`

### Modules
- `user.module.ts`
- `auth.module.ts`

### DTOs
- `create-user.dto.ts`
- `login.dto.ts`

### Interfaces
- `user.interface.ts`
- `auth-response.interface.ts`
