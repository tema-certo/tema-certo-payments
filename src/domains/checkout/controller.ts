import { Request, Response, NextFunction } from 'express';
import { CheckoutService } from '~/domains/checkout/services';
import { appConfig } from '~/config/app.config';
import { productPlanService } from '~/domains/product-plans/controller';
import { PaymentMethodTypes } from '~/domains/checkout/types';
import CheckoutImplementation from '~/domains/checkout/repository';
import { stripeWebhookQueue } from '~/queue/stripe-stream.queue';

const repository = new CheckoutImplementation();
export const checkoutService = new CheckoutService(repository);

export async function createSubscriptionCheckoutSession(request: Request, response: Response, next: NextFunction) {

    const { email } = request.user;
    const { product_identifier } = request.body;

    try {
        const productInfo = await productPlanService.findSecureId(product_identifier);

        const reference = await checkoutService.createCheckoutReference(request.user.id, product_identifier, 'pending');

        const session = await checkoutService.createSubscriptionCheckoutSession({
            mode: 'subscription',
            lineItems: [
                {
                    price: productInfo.stripe_price_id,
                    quantity: productInfo.quantity,
                },
            ],
            allowPromotionCodes: productInfo.allow_promotions_codes,
            // eslint-disable-next-line max-len
            successUrl: `${appConfig.principalFrontUrl}/${productInfo.url_success_callback}?session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: `${appConfig.principalFrontUrl}/${productInfo.url_failure_callback}`,
            customerEmail: email,
            metadata: {
                userId: request.user.id,
                productId: productInfo.secure_identifier,
                checkoutId: reference.id,
                daysToUse: productInfo.days_to_use,
                planName: productInfo.plan_name,
            },
            paymentMethodTypes: productInfo.permissioned_payment_types.split(',') as PaymentMethodTypes[],
        });

        response.json({
            client_secret: session.client_secret,
        });
    } catch (e) {
        next(e);
    }
}

export async function webhook(request: Request, response: Response, next: NextFunction) {
    const body = request.body;
    const signature = request.headers['stripe-signature'] as string;

    try {
        const event = await checkoutService.validateSignatureAndCreateEvent(body, signature);

        await stripeWebhookQueue.add('handle-stripe-event',
            {
                event,
            },
        );

        response.json({ received: true });
    } catch (e) {
        next(e);
    }
}
