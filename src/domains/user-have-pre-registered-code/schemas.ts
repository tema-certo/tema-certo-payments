import Joi from 'joi';

export const resendEmailConfirmationSchema = Joi.object({
    email: Joi.string().required().email(),
});

export const validateCodeConfirmationSchema = Joi.object({
    email: Joi.string().required().email(),
    code: Joi.string().required(),
});
