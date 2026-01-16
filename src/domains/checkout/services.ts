import StripeService from '~/domains/checkout/stripe';
import { CheckoutSession } from '~/domains/checkout/types';
import { SendCheckoutError } from '~/errors/checkout-errors';
import Stripe from 'stripe';
import { CheckoutRepository } from '~/domains/checkout/repository';
import Checkout from '~/domains/checkout/model';
import { DefaultHttpError } from '~/generic-errors';
import { addDays } from 'date-fns';
import { userService } from '~/domains/users/controller';
import { RoleByPlan } from '~/domains/permissions/model';
import { createAndSendHtmlRendered } from '~/mail/helpers';
import PaymentComing from '~/templates/PaymentComing';

const stripeService = new StripeService();

const firstPaymentSetup = ['checkout.session.completed'];
const edgeCasePaymentSetup = ['checkout.session.expired'];
const paymentComingSetup = ['invoice.upcoming'];
const failedCasesSetup = ['invoice.payment_failed', 'charge.failed'];

export class CheckoutService {
    constructor(private checkoutRepository: CheckoutRepository) {}

    async createSubscriptionCheckoutSession(checkoutSession: CheckoutSession) {
        return await stripeService.createCheckoutSession({
            ...checkoutSession,
        });
    }

    async createCheckoutReference(userId: number, productSafeId: string, status: Checkout['status']) {
        const checkout = await this.checkoutRepository.createCheckoutReference(userId, productSafeId, status);

        if (!checkout) {
            throw DefaultHttpError({ element: 'Checkout', error: 'NOT_CREATED' });
        }

        return checkout;
    }

    async validateSignatureAndCreateEvent(payload: Buffer, signature?: string) {
        if (!signature) {
            throw SendCheckoutError('NOT_FOUND_SIGNATURE');
        }

        return stripeService.createEvent(signature, payload);
    }

    async handleWebhookEvent(event: Stripe.Event) {
        const date = new Date();
        let metadata: Record<string, string> = {};

        if (firstPaymentSetup.includes(event.type) || edgeCasePaymentSetup.includes(event.type)) {
            const session = event.data.object as Stripe.Checkout.Session;
            metadata = session.metadata || {};
        }

        try {
            if (firstPaymentSetup.includes(event.type)) {
                await this.checkoutRepository.updateCheckoutReference(
                    {
                        id: Number(metadata?.checkoutId),
                        status: 'paid',
                        startedAt: date,
                        endsAt: addDays(date, Number(metadata?.daysToUse)),
                    },
                );

                const planName = metadata?.planName;
                const roleIdByPlan = RoleByPlan[planName!];

                if (!roleIdByPlan) {
                    throw SendCheckoutError('INVALID_ROLE_BY_PLAN');
                }

                await userService.updateUserWithId(Number(metadata?.userId), {
                    user_role_id: roleIdByPlan,
                });
            }

            if (edgeCasePaymentSetup.includes(event.type)) {
                await this.checkoutRepository.updateCheckoutReference(
                    {
                        id: Number(metadata?.checkoutId),
                        status: 'expired',
                    },
                );
            }

            if (paymentComingSetup.includes(event.type)) {
                const invoice  = event.data.object as Stripe.Invoice;

                await createAndSendHtmlRendered({
                    subject: 'Cobrança - Tema Certo',
                    html: PaymentComing,
                    to: invoice.customer_email,
                    props: {
                        name: invoice.customer_name,
                        value: (invoice.total / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
                    },
                });
            }

            if (failedCasesSetup.includes(event.type)) {
                await this.checkoutRepository.updateCheckoutReference(
                    {
                        id: Number(metadata?.checkoutId),
                        status: 'failed',
                    },
                );
            }
        } catch (e) {
            logger.error('Erro ao concluir checkout.', e);

            await this.checkoutRepository.updateCheckoutReference(
                {
                    id: Number(metadata?.checkoutId),
                    status: 'error',
                },
            );
        }
    }
}
