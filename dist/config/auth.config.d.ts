declare const _default: (() => {
    jwt: {
        secret: string;
        expiresIn: string;
        refreshExpiresIn: string;
        issuer: string;
        audience: string;
    };
    session: {
        secret: string;
    };
    google: {
        clientId: string;
        clientSecret: string;
        callbackUrl: string;
    };
    facebook: {
        appId: string;
        appSecret: string;
        callbackUrl: string;
    };
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    jwt: {
        secret: string;
        expiresIn: string;
        refreshExpiresIn: string;
        issuer: string;
        audience: string;
    };
    session: {
        secret: string;
    };
    google: {
        clientId: string;
        clientSecret: string;
        callbackUrl: string;
    };
    facebook: {
        appId: string;
        appSecret: string;
        callbackUrl: string;
    };
}>;
export default _default;
