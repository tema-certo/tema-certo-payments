import Stripe from 'stripe';
import { stripeConfig } from '~/config/stripe.config';
import { CheckoutSession } from '~/domains/checkout/types';

export default class StripeService {
    private static instance: StripeService;
    private readonly stripe: Stripe;

    constructor() {
        if (!stripeConfig.secretKey) {
            throw new Error('STRIPE_SECRET_KEY não configurada');
        }

        this.stripe = new Stripe(stripeConfig.secretKey, {
            apiVersion: '2025-12-15.clover',
            typescript: true,
        });
    }

    public static getInstance(): StripeService {
        if (!StripeService.instance) {
            StripeService.instance = new StripeService();
        }
        return StripeService.instance;
    }

    async createCheckoutSession({
        mode,
        lineItems,
        customerEmail,
        metadata,
        allowPromotionCodes,
        paymentMethodTypes,
    }: CheckoutSession) {
        try {
            return await this.stripe.checkout.sessions.create({
                mode,
                line_items: lineItems,
                customer_email: customerEmail,
                metadata,
                redirect_on_completion: 'never',
                allow_promotion_codes: allowPromotionCodes,
                payment_method_types: paymentMethodTypes,
                ui_mode: 'embedded',
            });
        } catch (e) {
            logger.error('Erro ao criar checkout session', metadata);

            throw e;
        }
    }
}
