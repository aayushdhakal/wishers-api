"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_module_1 = require("./app.module");
const helmet_1 = require("helmet");
const compression = require("compression");
const fs = require("fs");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    let app;
    try {
        const enableHttps = process.env.ENABLE_HTTPS === 'true';
        const nodeEnv = process.env.NODE_ENV || 'development';
        if (enableHttps) {
            const keyPath = nodeEnv === 'production'
                ? process.env.PROD_SSL_KEY_PATH || './certs/prod-key.pem'
                : process.env.SSL_KEY_PATH || './certs/key.pem';
            const certPath = nodeEnv === 'production'
                ? process.env.PROD_SSL_CERT_PATH || './certs/prod-cert.pem'
                : process.env.SSL_CERT_PATH || './certs/cert.pem';
            if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
                const httpsOptions = {
                    key: fs.readFileSync(keyPath),
                    cert: fs.readFileSync(certPath),
                };
                app = await core_1.NestFactory.create(app_module_1.AppModule, {
                    httpsOptions,
                    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
                });
                logger.log('HTTPS enabled with SSL certificates');
            }
            else {
                logger.warn(`SSL certificates not found at ${keyPath} and ${certPath}. Falling back to HTTP.`);
                app = await core_1.NestFactory.create(app_module_1.AppModule, {
                    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
                });
            }
        }
        else {
            app = await core_1.NestFactory.create(app_module_1.AppModule, {
                logger: ['error', 'warn', 'log', 'debug', 'verbose'],
            });
        }
        const configService = app.get(config_1.ConfigService);
        const port = configService.get('PORT', 3000);
        const httpsPort = configService.get('HTTPS_PORT', 3443);
        const frontendUrl = configService.get('FRONTEND_URL', 'http://localhost:3001');
        app.use((0, helmet_1.default)({
            contentSecurityPolicy: nodeEnv === 'production' ? undefined : false,
            crossOriginEmbedderPolicy: nodeEnv === 'production',
            hsts: nodeEnv === 'production' ? {
                maxAge: 31536000,
                includeSubDomains: true,
                preload: true,
            } : false,
        }));
        app.use(compression());
        app.enableCors({
            origin: [
                frontendUrl,
                'http://localhost:3000',
                'http://localhost:3001',
                'https://localhost:3000',
                'https://localhost:3001',
                'https://localhost:3443',
            ],
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: [
                'Origin',
                'X-Requested-With',
                'Content-Type',
                'Accept',
                'Authorization',
                'X-Access-Token',
                'X-Refresh-Token',
            ],
            exposedHeaders: [
                'Authorization',
                'X-Access-Token',
                'X-Refresh-Token',
                'X-Token-Expires',
            ],
            credentials: true,
            optionsSuccessStatus: 200,
        });
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }));
        app.setGlobalPrefix('api/v1', {
            exclude: ['/health', '/'],
        });
        const actualPort = enableHttps && fs.existsSync(process.env.SSL_KEY_PATH || './certs/key.pem') ? httpsPort : port;
        const protocol = enableHttps && fs.existsSync(process.env.SSL_KEY_PATH || './certs/key.pem') ? 'https' : 'http';
        await app.listen(actualPort);
        logger.log(`🚀 Application is running on: ${protocol}://localhost:${actualPort}`);
        logger.log(`📝 Environment: ${nodeEnv}`);
        logger.log(`🔒 HTTPS: ${enableHttps ? 'Enabled' : 'Disabled'}`);
        logger.log(`🌐 Frontend URL: ${frontendUrl}`);
        if (nodeEnv === 'development') {
            logger.log(`📚 API Documentation: ${protocol}://localhost:${actualPort}/api/v1`);
        }
    }
    catch (error) {
        logger.error('Failed to start the application', error);
        process.exit(1);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map