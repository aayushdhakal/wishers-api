"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('app', () => ({
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 3000,
    httpsPort: parseInt(process.env.HTTPS_PORT, 10) || 3443,
    enableHttps: process.env.ENABLE_HTTPS === 'true',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3001',
    ssl: {
        keyPath: process.env.NODE_ENV === 'production'
            ? process.env.PROD_SSL_KEY_PATH || './certs/prod-key.pem'
            : process.env.SSL_KEY_PATH || './certs/key.pem',
        certPath: process.env.NODE_ENV === 'production'
            ? process.env.PROD_SSL_CERT_PATH || './certs/prod-cert.pem'
            : process.env.SSL_CERT_PATH || './certs/cert.pem',
    },
    security: {
        rateLimitTtl: parseInt(process.env.RATE_LIMIT_TTL, 10) || 60000,
        rateLimitLimit: parseInt(process.env.RATE_LIMIT_LIMIT, 10) || 100,
    },
    logLevel: process.env.LOG_LEVEL || 'debug',
}));
//# sourceMappingURL=app.config.js.map