import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as compression from 'compression';
import * as fs from 'fs';
import * as https from 'https';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  // Create app instance
  let app;
  
  try {
    // Check if HTTPS is enabled and certificates exist
    const enableHttps = process.env.ENABLE_HTTPS === 'true';
    const nodeEnv = process.env.NODE_ENV || 'development';
    
    if (enableHttps) {
      const keyPath = nodeEnv === 'production' 
        ? process.env.PROD_SSL_KEY_PATH || './certs/prod-key.pem'
        : process.env.SSL_KEY_PATH || './certs/key.pem';
      
      const certPath = nodeEnv === 'production'
        ? process.env.PROD_SSL_CERT_PATH || './certs/prod-cert.pem'
        : process.env.SSL_CERT_PATH || './certs/cert.pem';

      // Check if certificate files exist
      if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
        const httpsOptions = {
          key: fs.readFileSync(keyPath),
          cert: fs.readFileSync(certPath),
        };
        
        app = await NestFactory.create(AppModule, { 
          httpsOptions,
          logger: ['error', 'warn', 'log', 'debug', 'verbose'],
        });
        
        logger.log('HTTPS enabled with SSL certificates');
      } else {
        logger.warn(`SSL certificates not found at ${keyPath} and ${certPath}. Falling back to HTTP.`);
        app = await NestFactory.create(AppModule, {
          logger: ['error', 'warn', 'log', 'debug', 'verbose'],
        });
      }
    } else {
      app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn', 'log', 'debug', 'verbose'],
      });
    }

    const configService = app.get(ConfigService);
    const port = configService.get('PORT', 3000);
    const httpsPort = configService.get('HTTPS_PORT', 3443);
    const frontendUrl = configService.get('FRONTEND_URL', 'http://localhost:3001');
    
    // Security Middleware
    app.use(helmet({
      contentSecurityPolicy: nodeEnv === 'production' ? undefined : false,
      crossOriginEmbedderPolicy: nodeEnv === 'production',
      referrerPolicy: nodeEnv === 'production' ? 
        { policy: 'strict-origin-when-cross-origin' } : 
        false, // Disable referrer policy in development
      hsts: nodeEnv === 'production' ? {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      } : false,
    }));
    
    // Compression
    app.use(compression());
    
    // CORS Configuration
    app.enableCors({
      origin: [
        frontendUrl,
        'http://localhost:3000',
        'http://localhost:3001',
        'https://localhost:3000',
        'https://localhost:3001',
        'https://localhost:3443',
        'http://localhost:5173',
        'http://192.168.10.68:*'
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
        'Referer',
        'User-Agent',
        'X-Request-Time',
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
    
    // Global Validation Pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    
    // Global prefix for API routes
    app.setGlobalPrefix('api/v1', {
      exclude: ['/health', '/', '/auth/callback'],
    });
    
    // Start the server
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
    
  } catch (error) {
    logger.error('Failed to start the application', error);
    process.exit(1);
  }
}

bootstrap();
