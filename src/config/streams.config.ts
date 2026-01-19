const {
    STREAMS_STRIPE_WEBHOOK,
    AMQP_BASE_URL,
} = process.env;

export const streamsConfig = {
    stripeWebhook: String(STREAMS_STRIPE_WEBHOOK),
    amqpBaseUrl: String(AMQP_BASE_URL),
};
