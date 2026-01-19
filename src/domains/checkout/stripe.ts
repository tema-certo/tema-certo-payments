import Stripe from 'stripe';
import { stripeConfig } from '~/config/stripe.config';
import { CheckoutSession } from '~/domains/checkout/types';

export function setupStripe() {
    if (!stripeConfig.secretKey) {
        throw new Error('STRIPE_SECRET_KEY não configurada');
    }

    return new Stripe(stripeConfig.secretKey, {
        apiVersion: '2025-12-15.clover',
    });
}

export default class StripeService {

    private readonly stripe = setupStripe();

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
                subscription_data: {
                    metadata,
                },
                ui_mode: 'embedded',
                locale: 'pt-BR',
            });
        } catch (e) {
            logger.error('Erro ao criar checkout session', metadata);

            throw e;
        }
    }

    createEvent(signature: string, payload: Buffer) {
        try {
            return this.stripe.webhooks.constructEvent(payload, signature, stripeConfig.secretWebhookKey);
        } catch (e) {
            logger.error('Erro ao criar evento', e);

            throw e;
        }
    }

    async retrieveInvoice(invoiceId: string) {
        try {
            return await this.stripe.invoices.retrieve(invoiceId);
        } catch (e) {
            logger.error('Erro ao buscar invoice', e);

            throw e;
        }
    }

    async retriveSub(subscriptionId: string)  {
        try {
            return await this.stripe.subscriptions.retrieve(subscriptionId);
        } catch (e) {
            logger.error('Erro ao buscar subscription', e);

            throw e;
        }
    }
}
