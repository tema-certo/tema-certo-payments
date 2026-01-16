import { HttpError } from '~/generic-errors';

export enum CheckoutErrors {
    NOT_FOUND_SIGNATURE,
    FAILURE_SETUP_GROUP,
    INVALID_ROLE_BY_PLAN,
}

export const CheckoutErrorsData = {
    NOT_FOUND_SIGNATURE: {
        message: 'Signature not found',
        status: 404,
        code: 'NOT_FOUND_SIGNATURE',
        retryable: false,
    },
    FAILURE_SETUP_GROUP: {
        message: 'Failure setup group',
        status: 500,
        code: 'FAILURE_SETUP_GROUP',
        retryable: false,
    },
    INVALID_ROLE_BY_PLAN: {
        message: 'Invalid role by plan',
        status: 500,
        code: 'INVALID_ROLE_BY_PLAN',
        retryable: false,
    },
};

export function SendCheckoutError(error: keyof typeof CheckoutErrors): never {
    const { message, status, code } = CheckoutErrorsData[error];

    throw new HttpError(message, status, code);
}
