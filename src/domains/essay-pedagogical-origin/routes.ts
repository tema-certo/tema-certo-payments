import { Router } from 'express';
import { AppRouter } from '~/types/Router';
import { getAllPossiblePedagogicalOrigin } from '~/domains/essay-pedagogical-origin/controller';

export const essayPedagogicalOriginRouter = Router();

const routes: AppRouter[] = [
    {
        toAuthenticated: true,
        method: 'get',
        path: '/classification-possibilities',
        handler: getAllPossiblePedagogicalOrigin,
    },
];

export default routes;
