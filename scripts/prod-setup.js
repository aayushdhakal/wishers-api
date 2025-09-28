#!/usr/bin/env node

/**
 * Production Setup Script
 * This script helps prepare the application for production deployment
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🏭 Setting up production configuration...');

// Generate secure random secrets
function generateSecret(length = 64) {
  return crypto.randomBytes(length).toString('hex');
}

// Create production environment template
const prodEnvPath = path.join(__dirname, '..', '.env.production.example');

console.log('📝 Creating production environment template...');

const prodEnvContent = `# Production Environment Configuration
NODE_ENV=production
PORT=3000
HTTPS_PORT=443
ENABLE_HTTPS=true

# Database (Update with your production database URL)
DATABASE_URL="mysql://username:password@your-db-host:3306/wishin_prod"

# JWT Configuration (CHANGE THESE IN PRODUCTION!)
JWT_SECRET="${generateSecret(64)}"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Frontend URL (Update with your production frontend URL)
FRONTEND_URL="https://your-domain.com"

# SSL Certificates (Production)
PROD_SSL_KEY_PATH="/etc/ssl/private/your-domain.key"
PROD_SSL_CERT_PATH="/etc/ssl/certs/your-domain.crt"

# Session Secret (CHANGE THIS IN PRODUCTION!)
SESSION_SECRET="${generateSecret(64)}"

# OAuth Configuration (Update with your production OAuth credentials)
GOOGLE_CLIENT_ID="your-production-google-client-id"
GOOGLE_CLIENT_SECRET="your-production-google-client-secret"
GOOGLE_CALLBACK_URL="https://your-domain.com/api/v1/auth/google/callback"

FACEBOOK_APP_ID="your-production-facebook-app-id"
FACEBOOK_APP_SECRET="your-production-facebook-app-secret"
FACEBOOK_CALLBACK_URL="https://your-domain.com/api/v1/auth/facebook/callback"

# Rate Limiting (Adjust for production load)
RATE_LIMIT_TTL=60000
RATE_LIMIT_LIMIT=1000

# Logging
LOG_LEVEL=warn
`;

fs.writeFileSync(prodEnvPath, prodEnvContent);
console.log('✅ Production environment template created: .env.production.example');

// Create production checklist
const checklistPath = path.join(__dirname, '..', 'PRODUCTION_CHECKLIST.md');

const checklistContent = `# Production Deployment Checklist

## ⚠️ Security Checklist

### Environment Variables
- [ ] Update \`JWT_SECRET\` with a strong, unique secret
- [ ] Update \`SESSION_SECRET\` with a strong, unique secret  
- [ ] Set \`NODE_ENV=production\`
- [ ] Update \`DATABASE_URL\` with production database credentials
- [ ] Update \`FRONTEND_URL\` with production frontend URL
- [ ] Configure OAuth credentials for production

### SSL/TLS Configuration
- [ ] Obtain valid SSL certificates (Let's Encrypt, commercial CA)
- [ ] Update \`PROD_SSL_KEY_PATH\` and \`PROD_SSL_CERT_PATH\`
- [ ] Set \`ENABLE_HTTPS=true\`
- [ ] Configure certificate auto-renewal

### Database Security
- [ ] Use strong database passwords
- [ ] Enable SSL for database connections
- [ ] Configure database firewall rules
- [ ] Set up database backups

### Server Security
- [ ] Configure firewall (allow only 80, 443, SSH)
- [ ] Set up fail2ban or similar intrusion prevention
- [ ] Configure automatic security updates
- [ ] Set up monitoring and alerting

## 🚀 Performance Checklist

### Application
- [ ] Enable compression middleware ✅
- [ ] Configure proper logging levels
- [ ] Set up health check endpoints
- [ ] Configure rate limiting for production load

### Infrastructure
- [ ] Set up load balancer (if needed)
- [ ] Configure CDN for static assets
- [ ] Set up database connection pooling
- [ ] Configure caching (Redis/Memcached)

## 📊 Monitoring Checklist

### Logging
- [ ] Set up centralized logging (ELK stack, etc.)
- [ ] Configure log rotation
- [ ] Set up error tracking (Sentry, etc.)

### Metrics
- [ ] Set up application metrics
- [ ] Configure server monitoring
- [ ] Set up database monitoring
- [ ] Configure uptime monitoring

## 🔄 Deployment Checklist

### CI/CD
- [ ] Set up automated testing
- [ ] Configure automated deployment
- [ ] Set up staging environment
- [ ] Configure rollback procedures

### Backup & Recovery
- [ ] Set up automated database backups
- [ ] Test backup restoration procedures
- [ ] Configure file backup (if applicable)
- [ ] Document recovery procedures

## 🧪 Testing Checklist

### Security Testing
- [ ] Run security audit (\`npm audit\`)
- [ ] Test HTTPS configuration
- [ ] Verify CORS settings
- [ ] Test authentication flows

### Performance Testing
- [ ] Load testing
- [ ] Database performance testing
- [ ] Memory leak testing
- [ ] API response time testing

### Functional Testing
- [ ] End-to-end testing
- [ ] API integration testing
- [ ] OAuth flow testing
- [ ] Error handling testing

## 📋 Launch Checklist

### Pre-Launch
- [ ] All tests passing
- [ ] Security scan completed
- [ ] Performance benchmarks met
- [ ] Documentation updated

### Launch
- [ ] Deploy to production
- [ ] Verify all services running
- [ ] Test critical user flows
- [ ] Monitor error rates

### Post-Launch
- [ ] Monitor application metrics
- [ ] Check error logs
- [ ] Verify backup systems
- [ ] Update team documentation

---

## 🔧 Useful Production Commands

### SSL Certificate Setup (Let's Encrypt)
\`\`\`bash
# Install Certbot
sudo apt-get install certbot

# Get certificate
sudo certbot certonly --standalone -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
\`\`\`

### PM2 Process Management
\`\`\`bash
# Install PM2
npm install -g pm2

# Start application
pm2 start dist/main.js --name wishin-api

# Save PM2 configuration
pm2 save
pm2 startup
\`\`\`

### Database Migration
\`\`\`bash
# Run migrations
npm run db:migrate

# Generate Prisma client
npm run db:generate
\`\`\`

### Health Check
\`\`\`bash
# Check application health
curl -f https://your-domain.com/api/v1/health || exit 1
\`\`\`
`;

fs.writeFileSync(checklistPath, checklistContent);
console.log('✅ Production checklist created: PRODUCTION_CHECKLIST.md');

console.log('\n🎉 Production setup complete!');
console.log('\n📋 Next steps:');
console.log('1. Copy .env.production.example to .env.production');
console.log('2. Update all production values in .env.production');
console.log('3. Review PRODUCTION_CHECKLIST.md');
console.log('4. Obtain SSL certificates for your domain');
console.log('5. Deploy to your production server');
console.log('\n⚠️  Important: Never commit .env.production to version control!');
