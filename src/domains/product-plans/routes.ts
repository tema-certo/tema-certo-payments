import { Router } from 'express';
import { AppRouter } from '~/types/Router';
import { findManyProducts } from '~/domains/product-plans/controller';

export const router = Router();

const routes: AppRouter[] = [
    {
        toAuthenticated: true,
        method: 'get',
        path: '/possible-client-plans',
        handler: findManyProducts,
    },
];

export default routes;
