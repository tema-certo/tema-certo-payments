import { createClient, RedisClientType } from 'redis';
import { Redis } from 'ioredis';
import { appConfig } from '~/config/app.config';

let redisClient: RedisClientType;

export function redisConnector() {
    return new Redis(appConfig.redisUrl!, {
        maxRetriesPerRequest: null,
    });
}

export async function redisSetup(url: string) {
    redisClient = createClient({
        url,
    });

    redisClient.on('error', (e) => logger.error('Redis error:', e));

    await redisClient.connect();
    logger.info('Redis connected');

    return redisClient;
}
