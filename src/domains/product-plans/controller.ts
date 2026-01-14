import ProductPlanService from '~/domains/product-plans/services';
import ProductPlanImplementation from '~/domains/product-plans/repository';
import { NextFunction, Request, Response } from 'express';

export const productPlanService = new ProductPlanService(new ProductPlanImplementation());

export async function findManyProducts(_: Request, response: Response, next: NextFunction) {
    try {
        const products = await productPlanService.findManyProducts({ uiSecurity: true });

        response.json(products);
    } catch (e) {
        next(e);
    }
}
