import '~/knex';
import { Worker } from 'bullmq';
import { streamsConfig } from '~/config/streams.config';
import { checkoutService } from '~/domains/checkout/controller';
import { redisConnector } from '~/redis';

export async function stripeEventConsumer() {
    return new Worker(streamsConfig.stripeWebhook, async job => {
        const { event } = job.data;

        await checkoutService.handleWebhookEvent(event);
    }, {
        concurrency: 2,
        connection: redisConnector(),
    },
    );

}
