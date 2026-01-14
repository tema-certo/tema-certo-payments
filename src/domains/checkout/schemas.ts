import Joi from 'joi';

export const createCheckoutSessionSchema = Joi.object({
    product_identifier: Joi.string().required(),
});
