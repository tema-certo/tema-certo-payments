const {
    STRIPE_SEC_KEY,
} = process.env;

export const stripeConfig = {
    secretKey: String(STRIPE_SEC_KEY),
};
