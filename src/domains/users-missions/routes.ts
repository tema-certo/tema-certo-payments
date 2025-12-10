import { Router } from 'express';
import { AppRouter } from '~/types/Router';
import { getUserMissions } from '~/domains/users-missions/controller';

export const userMissionsRouter = Router();

const routes: AppRouter[] = [
    {
        toAuthenticated: true,
        method: 'get',
        path: '/get-user-missions',
        handler: getUserMissions,
    },
];

export default routes;
