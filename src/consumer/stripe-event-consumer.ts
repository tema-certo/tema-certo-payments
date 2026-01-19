import '~/knex';
import { streamsConfig } from '~/config/streams.config';
import { checkoutService } from '~/domains/checkout/controller';
import { getChannelMQ } from '~/queue/stripe-stream.queue';
import Stripe from 'stripe';

export async function stripeEventConsumer() {
    const channel = await getChannelMQ({
        queueSetter: streamsConfig.stripeWebhook,
        settings: {
            durable: true,
        },
    });

    // Config channel
    await channel.prefetch(2);

    await channel.consume(streamsConfig.stripeWebhook, async (message) => {
        if (!message) {
            return;
        }

        try {
            const event = JSON.parse(message.content.toString()) as { event: Stripe.Event };

            await checkoutService.handleWebhookEvent(event.event);

            channel.ack(message);
        } catch (e) {
            logger.error('Erro ao consumir evento do Stripe.', e);

            channel.nack(message, false, true);
        }
    });

}
