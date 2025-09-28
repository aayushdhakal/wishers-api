declare const _default: (() => {
    nodeEnv: string;
    port: number;
    httpsPort: number;
    enableHttps: boolean;
    frontendUrl: string;
    ssl: {
        keyPath: string;
        certPath: string;
    };
    security: {
        rateLimitTtl: number;
        rateLimitLimit: number;
    };
    logLevel: string;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    nodeEnv: string;
    port: number;
    httpsPort: number;
    enableHttps: boolean;
    frontendUrl: string;
    ssl: {
        keyPath: string;
        certPath: string;
    };
    security: {
        rateLimitTtl: number;
        rateLimitLimit: number;
    };
    logLevel: string;
}>;
export default _default;
