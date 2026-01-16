import './setup';
import { stripeEventConsumer } from '~/consumer/stripe-event-consumer';
import { redisSetup } from '~/redis';
import { appConfig } from '~/config/app.config';
import logger from './logger';

async function bootStrapConsumer() {
    await redisSetup(String(appConfig.redisUrl)!);

    await stripeEventConsumer();
}

bootStrapConsumer().catch(e => logger.error(e));
