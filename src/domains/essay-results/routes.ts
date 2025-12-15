import { Router } from 'express';
import { AppRouter } from '~/types/Router';
import { getUserHighScores, userAverageScore, userLastResults, userStatisticsResults } from './controller';
import { permissionMiddleware } from '~/middlewares/permission';
import { UserRoles } from '../permissions/model';

export const essayResultsRouter = Router();

// Routes
const routes: AppRouter[] = [
    {
        toAuthenticated: true,
        method: 'get',
        path: '/get-user-average-score',
        handler: userAverageScore,
        middlewares: [
            permissionMiddleware([UserRoles.USER, UserRoles.TRIAL]),
        ],
    },
    {
        toAuthenticated: true,
        method: 'get',
        path: '/user-metrics',
        handler: userStatisticsResults,
        middlewares: [
            permissionMiddleware([UserRoles.USER, UserRoles.TRIAL]),
        ],
    },
    {
        toAuthenticated: true,
        method: 'get',
        path: '/last-essays-completed',
        handler: userLastResults,
        middlewares: [
            permissionMiddleware([UserRoles.USER, UserRoles.TRIAL]),
        ],
    },
    {
        toAuthenticated: true,
        method: 'get',
        path: '/most-high-scores',
        handler: getUserHighScores,
        middlewares: [
            permissionMiddleware([UserRoles.USER, UserRoles.TRIAL]),
        ],
    },
];

export default routes;
