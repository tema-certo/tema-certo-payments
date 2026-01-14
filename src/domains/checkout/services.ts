import StripeService from '~/domains/checkout/stripe';
import { CheckoutSession } from '~/domains/checkout/types';

const stripeService = new StripeService();

export class CheckoutService {
    async createSubscriptionCheckoutSession(checkoutSession: CheckoutSession) {
        return await stripeService.createCheckoutSession({
            ...checkoutSession,
        });
    }
}
