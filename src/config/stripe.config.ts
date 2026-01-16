const {
    STRIPE_SEC_KEY,
    STRIPE_WEBHOOK_KEY,
} = process.env;

export const stripeConfig = {
    secretKey: String(STRIPE_SEC_KEY),
    secretWebhookKey: String(STRIPE_WEBHOOK_KEY),
};
