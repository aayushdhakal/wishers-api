# NestJS Commands Quick Reference

## Development Commands
```bash
# Development server with hot reload
npm run start:dev

# Development server with debug mode  
npm run start:debug

# Production build
npm run build

# Start production server
npm run start:prod
```

## Code Quality Commands
```bash
# Format code with Prettier
npm run format

# Lint code with ESLint
npm run lint

# Fix linting issues
npm run lint -- --fix
```

## Testing Commands
```bash
# Run unit tests
npm test
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:cov

# Run end-to-end tests
npm run test:e2e

# Debug tests
npm run test:debug
```

## NestJS CLI Generation Commands
```bash
# Generate controller
nest generate controller <name>
nest g co <name>

# Generate service
nest generate service <name>
nest g s <name>

# Generate module
nest generate module <name>
nest g mo <name>

# Generate guard
nest generate guard <name>
nest g gu <name>

# Generate interceptor
nest generate interceptor <name>
nest g in <name>

# Generate pipe
nest generate pipe <name>
nest g pi <name>

# Generate decorator
nest generate decorator <name>
nest g d <name>

# Generate middleware
nest generate middleware <name>
nest g mi <name>

# Generate complete CRUD resource
nest generate resource <name>
nest g res <name>

# Generate filter
nest generate filter <name>
nest g f <name>
```

## Authentication Generation (Future Use)
```bash
# Generate auth module
nest g mo auth
nest g co auth
nest g s auth

# Generate auth guards
nest g gu auth/guards/jwt-auth
nest g gu auth/guards/local-auth

# Generate auth strategies
nest g s auth/strategies/local
nest g s auth/strategies/jwt
nest g s auth/strategies/google
nest g s auth/strategies/facebook
```

## Project Information Commands
```bash
# Show NestJS CLI version
nest --version

# Show project info
nest info

# Show available commands
nest --help

# Show help for specific command
nest generate --help
```

## Development Workflow
```bash
# 1. Start development server
npm run start:dev

# 2. Generate new feature
nest g res users

# 3. Run tests
npm test

# 4. Format and lint
npm run format
npm run lint

# 5. Build for production
npm run build
```
