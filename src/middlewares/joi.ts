import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { createValidationError } from '~/generic-errors';
import logger from '~/logger';
import { isDevelopment } from '~/global';

interface JoiValidator {
    schema: Joi.ObjectSchema;
    type: 'body' | 'query' | 'file' | 'params';
    abortEarly?: boolean;
    stripUnknown?: boolean;
    allowUnknown?: boolean;
    convert?: boolean;
}

export const validateRequest = ({
    schema,
    type,
    abortEarly = false,
    stripUnknown = true,
    allowUnknown = true,
    convert = false,
}: JoiValidator) => {
    return (request: Request, response: Response, next: NextFunction) => {
        const {
            error,
            value,
        } = schema.validate(request[type], {
            abortEarly,
            stripUnknown,
            allowUnknown,
            convert,
        },
        );

        if (error || !value) {
            logger.warn('Validation error');

            response.status(400).json({
                info: 'Algumas informações estão faltando ou no formato incorreto.',
                details: isDevelopment ? createValidationError(type, error) : undefined,
            });
            return;
        }
        request[type] = value;
        next();
    };
};
