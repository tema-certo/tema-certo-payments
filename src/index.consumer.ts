import './setup';
import { stripeEventConsumer } from '~/consumer/stripe-event-consumer';
import logger from './logger';

async function bootStrapConsumer() {
    await stripeEventConsumer();
}

bootStrapConsumer().catch(e => logger.error(e));
