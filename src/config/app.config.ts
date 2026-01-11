const {
    DEFAULT_PORT,
    LOCAL,
    REDIS_URL,
    PRINCIPAL_FRONT_URL,
} = process.env;

export const appConfig = {
    local: LOCAL,
    port: DEFAULT_PORT,
    redisUrl: REDIS_URL,
    principalFrontUrl: PRINCIPAL_FRONT_URL,
};
