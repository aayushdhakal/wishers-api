#!/usr/bin/env node

/**
 * Development HTTPS Setup Script
 * This script helps set up HTTPS for development environment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const certsDir = path.join(__dirname, '..', 'certs');
const keyPath = path.join(certsDir, 'key.pem');
const certPath = path.join(certsDir, 'cert.pem');

console.log('🔧 Setting up HTTPS for development...');

// Create certs directory if it doesn't exist
if (!fs.existsSync(certsDir)) {
  fs.mkdirSync(certsDir, { recursive: true });
  console.log('📁 Created certs directory');
}

// Generate self-signed certificate if it doesn't exist
if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
  console.log('🔐 Generating self-signed SSL certificate...');
  
  try {
    execSync(`openssl req -x509 -newkey rsa:4096 -keyout "${keyPath}" -out "${certPath}" -days 365 -nodes -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"`, {
      stdio: 'inherit'
    });
    
    console.log('✅ SSL certificate generated successfully!');
  } catch (error) {
    console.error('❌ Failed to generate SSL certificate:', error.message);
    console.log('💡 Make sure OpenSSL is installed on your system');
    process.exit(1);
  }
} else {
  console.log('✅ SSL certificates already exist');
}

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file...');
  
  const envContent = `# Development Environment Configuration
NODE_ENV=development
PORT=3000
HTTPS_PORT=3443
ENABLE_HTTPS=true

# Database
DATABASE_URL="mysql://username:password@localhost:3306/wishin"

# JWT Configuration
JWT_SECRET="dev-jwt-secret-key-change-in-production"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Frontend URL
FRONTEND_URL="https://localhost:3001"

# SSL Certificates (Development)
SSL_KEY_PATH="./certs/key.pem"
SSL_CERT_PATH="./certs/cert.pem"

# Session Secret
SESSION_SECRET="dev-session-secret-change-in-production"

# Rate Limiting
RATE_LIMIT_TTL=60000
RATE_LIMIT_LIMIT=100

# Logging
LOG_LEVEL=debug
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created with development defaults');
  console.log('⚠️  Please update the database URL and other secrets in .env');
} else {
  console.log('✅ .env file already exists');
}

console.log('\n🚀 Development HTTPS setup complete!');
console.log('\n📋 Next steps:');
console.log('1. Update your .env file with actual database credentials');
console.log('2. Run: npm run start:dev');
console.log('3. Visit: https://localhost:3443');
console.log('4. Accept the self-signed certificate warning in your browser');
console.log('\n⚠️  Note: Self-signed certificates will show a security warning in browsers');
console.log('   This is normal for development. Click "Advanced" -> "Proceed to localhost"');
