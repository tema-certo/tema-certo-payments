import { Router } from 'express';
import { AppRouter } from '~/types/Router';
import { resendEmailConfirmation, validateCodeConfirmation } from '~/domains/user-have-pre-registered-code/controller';
import { validateRequest } from '~/middlewares/joi';
import {
    resendEmailConfirmationSchema,
    validateCodeConfirmationSchema,
} from '~/domains/user-have-pre-registered-code/schemas';

export const preRegisterRouter = Router();

const routes: AppRouter[] = [
    {
        method: 'post',
        path: '/resend-email-confirmation',
        handler: resendEmailConfirmation,
        middlewares: [
            validateRequest({
                schema: resendEmailConfirmationSchema,
                type: 'body',
            }),
        ],
    },
    {
        method: 'post',
        path: '/validate-code-confirmation',
        handler: validateCodeConfirmation,
        middlewares: [
            validateRequest({
                schema: validateCodeConfirmationSchema,
                type: 'body',
            }),
        ],
    },
];

export default routes;
