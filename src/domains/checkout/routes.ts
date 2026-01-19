import { Router } from 'express';
import { createSubscriptionCheckoutSession } from '~/domains/checkout/controller';
import { AppRouter } from '~/types/Router';
import { validateRequest } from '~/middlewares/joi';
import { createCheckoutSessionSchema } from '~/domains/checkout/schemas';

export const router = Router();

const routes: AppRouter[] = [
    {
        toAuthenticated: true,
        method: 'post',
        path: '/create-checkout-session',
        handler: createSubscriptionCheckoutSession,
        middlewares: [
            validateRequest({
                schema: createCheckoutSessionSchema,
                type: 'body',
                stripUnknown: true,
            }),
        ],
    },
];

export default routes;
