import { Queue } from 'bullmq';
import { redisConnector } from '~/redis';
import { streamsConfig } from '~/config/streams.config';

export const stripeWebhookQueue = new Queue(streamsConfig.stripeWebhook, {
    connection: redisConnector(),
});
