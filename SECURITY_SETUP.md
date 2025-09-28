# 🔒 Security Setup Guide

This guide explains how to set up HTTPS and security features for both development and production environments.

## 🚀 Quick Start

### Development Setup
```bash
# Set up HTTPS for development
npm run setup:dev

# Start with HTTPS enabled
npm run start:https
```

### Production Setup
```bash
# Generate production configuration templates
npm run setup:prod

# Review the production checklist
cat PRODUCTION_CHECKLIST.md
```

## 🛡️ Security Features Implemented

### ✅ HTTPS/TLS
- **Development**: Self-signed certificates for local HTTPS
- **Production**: Support for valid SSL certificates
- **Auto-detection**: Falls back to HTTP if certificates are missing
- **Flexible ports**: Configurable HTTP/HTTPS ports

### ✅ Security Headers (Helmet.js)
- **Content Security Policy**: Configurable per environment
- **HSTS**: HTTP Strict Transport Security for production
- **X-Frame-Options**: Prevents clickjacking
- **X-Content-Type-Options**: Prevents MIME sniffing
- **Referrer-Policy**: Controls referrer information

### ✅ CORS Configuration
- **Origin whitelist**: Configurable allowed origins
- **Credentials**: Support for authenticated requests
- **Exposed headers**: JWT token headers exposed to clients
- **Methods**: Restricted to necessary HTTP methods

### ✅ Input Validation
- **Global validation pipe**: Automatic DTO validation
- **Whitelist**: Strips unknown properties
- **Transform**: Automatic type conversion
- **Sanitization**: Prevents injection attacks

### ✅ JWT Security
- **Short expiry**: 15-minute access tokens
- **Refresh tokens**: 7-day refresh tokens (ready for implementation)
- **Secure secrets**: Environment-based configuration
- **Issuer/Audience**: Token validation with claims

## 📁 File Structure

```
src/
├── config/                    # Configuration files
│   ├── app.config.ts         # Application configuration
│   ├── auth.config.ts        # Authentication configuration
│   ├── database.config.ts    # Database configuration
│   └── index.ts              # Configuration exports
├── main.ts                   # Enhanced with security middleware
└── ...

scripts/
├── dev-https.js              # Development HTTPS setup
└── prod-setup.js             # Production configuration generator

certs/                        # SSL certificates (development)
├── key.pem                   # Private key
└── cert.pem                  # Certificate
```

## 🔧 Configuration

### Environment Variables

#### Development (.env)
```env
NODE_ENV=development
ENABLE_HTTPS=true
PORT=3000
HTTPS_PORT=3443
JWT_SECRET="your-dev-secret"
FRONTEND_URL="https://localhost:3001"
SSL_KEY_PATH="./certs/key.pem"
SSL_CERT_PATH="./certs/cert.pem"
```

#### Production (.env.production)
```env
NODE_ENV=production
ENABLE_HTTPS=true
PORT=3000
HTTPS_PORT=443
JWT_SECRET="your-super-secure-production-secret"
FRONTEND_URL="https://yourdomain.com"
PROD_SSL_KEY_PATH="/etc/ssl/private/yourdomain.key"
PROD_SSL_CERT_PATH="/etc/ssl/certs/yourdomain.crt"
```

## 🌐 Development HTTPS Setup

### Automatic Setup
```bash
npm run setup:dev
```

This script will:
1. Create the `certs/` directory
2. Generate self-signed SSL certificates
3. Create a `.env` file with development defaults

### Manual Setup
```bash
# Create certificates directory
mkdir certs

# Generate self-signed certificate
openssl req -x509 -newkey rsa:4096 -keyout certs/key.pem -out certs/cert.pem -days 365 -nodes -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

# Start with HTTPS
ENABLE_HTTPS=true npm run start:dev
```

### Browser Certificate Warning
When using self-signed certificates, browsers will show a security warning:

1. Click "Advanced" or "Show details"
2. Click "Proceed to localhost (unsafe)" or similar
3. The certificate will be remembered for future visits

## 🏭 Production HTTPS Setup

### 1. Generate Configuration
```bash
npm run setup:prod
```

### 2. Obtain SSL Certificates

#### Option A: Let's Encrypt (Free)
```bash
# Install Certbot
sudo apt-get install certbot

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com

# Certificates will be at:
# /etc/letsencrypt/live/yourdomain.com/privkey.pem
# /etc/letsencrypt/live/yourdomain.com/fullchain.pem
```

#### Option B: Commercial Certificate
1. Purchase SSL certificate from a CA
2. Follow CA instructions to generate and install
3. Update certificate paths in `.env.production`

### 3. Update Configuration
```bash
# Copy template
cp .env.production.example .env.production

# Edit with your values
nano .env.production
```

### 4. Deploy
```bash
# Build application
npm run build

# Start in production mode
NODE_ENV=production npm run start:prod
```

## 🔍 Security Testing

### SSL Configuration Test
```bash
# Test HTTPS locally
curl -k https://localhost:3443/api/v1/health

# Test production (replace with your domain)
curl https://yourdomain.com/api/v1/health
```

### Security Headers Test
```bash
# Check security headers
curl -I https://localhost:3443/api/v1/health

# Should include:
# Strict-Transport-Security (production only)
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# X-XSS-Protection: 0
```

### JWT Token Test
```bash
# Login to get token
curl -X POST https://localhost:3443/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Use token for authenticated request
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://localhost:3443/api/v1/auth/profile
```

## 🚨 Security Audit

### Regular Audits
```bash
# Run security audit
npm run security:audit

# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

### Security Checklist
- [ ] Strong JWT secrets (64+ characters)
- [ ] Valid SSL certificates
- [ ] HTTPS-only in production
- [ ] Secure CORS configuration
- [ ] Rate limiting configured
- [ ] Input validation enabled
- [ ] Security headers configured
- [ ] Database credentials secured
- [ ] Environment variables protected

## 🔄 Certificate Renewal

### Let's Encrypt Auto-Renewal
```bash
# Test renewal
sudo certbot renew --dry-run

# Set up auto-renewal cron job
sudo crontab -e

# Add this line:
0 12 * * * /usr/bin/certbot renew --quiet
```

### Commercial Certificate Renewal
1. Monitor certificate expiry dates
2. Renew before expiration
3. Update certificate files
4. Restart application

## 🐛 Troubleshooting

### Common Issues

#### Certificate Not Found
```
Error: ENOENT: no such file or directory, open './certs/key.pem'
```
**Solution**: Run `npm run setup:dev` to generate certificates

#### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3443
```
**Solution**: Kill process using the port or change HTTPS_PORT

#### CORS Errors
```
Access to fetch at 'https://localhost:3443' from origin 'http://localhost:3000' has been blocked by CORS
```
**Solution**: Update FRONTEND_URL in .env and restart

#### JWT Secret Warning
```
Warning: Using default JWT secret
```
**Solution**: Set strong JWT_SECRET in environment variables

### Debug Mode
```bash
# Start with debug logging
LOG_LEVEL=debug npm run start:dev
```

## 📚 Additional Resources

- [OWASP Security Guidelines](https://owasp.org/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Helmet.js Documentation](https://helmetjs.github.io/)
- [NestJS Security Documentation](https://docs.nestjs.com/security/authentication)

## 🤝 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review the production checklist
3. Check application logs for detailed error messages
4. Ensure all environment variables are properly configured
