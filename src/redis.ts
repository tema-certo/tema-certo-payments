import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType;

export async function redisSetup(url: string) {
    try {
        redisClient = createClient({
            url,
        });

        redisClient.on('error', (e) => logger.error('Redis error:', e));

        await redisClient.connect();
        logger.info('Redis connected');

        return redisClient;
    } catch (e) {
        logger.error('Redis connection error:', e);

        throw e;
    }
}
