const {
    STREAMS_STRIPE_WEBHOOK,
} = process.env;

export const streamsConfig = {
    stripeWebhook: String(STREAMS_STRIPE_WEBHOOK),
};
