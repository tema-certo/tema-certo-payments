import { RequestHandler, Router } from 'express';
import swaggerUi from 'swagger-ui-express';

import { AppRouter, UseRoute } from './types/Router';
import { OpenAPIV3 } from 'openapi-types';
import { appConfig } from './config/app.config';
import { authentication } from './middlewares/authentication';
import checkoutRoutes, { router as checkoutRouter } from './domains/checkout/routes';
import productPlansRoutes, { router as productPlansRouter } from './domains/product-plans/routes';

// ==== ROUTES REGISTER ====

const defaultRoutes = Router();
export const swaggerPaths: Record<string, any> = {};

export function registerRoute(router: Router, routes: AppRouter[]) {
    routes.forEach(({ toAuthenticated, method, path, middlewares = [], handler, swagger }) => {
        const middlewaresGroup: RequestHandler[] = [];

        if (toAuthenticated) {
            middlewaresGroup.push(authentication);
        }

        middlewaresGroup.push(...middlewares);

        router[method](path, ...middlewaresGroup, handler);

        if (swagger) {
            const fullPath = path.replace(/\/+/g, '/');
            swaggerPaths[fullPath] = {
                ...(swaggerPaths[fullPath] || {}),
                [method]: {
                    ...swagger,
                },
            };
        }
    });
}

// ==== END ROUTES REGISTER ====

// ==== ROUTES ====

const useRoutes: Array<UseRoute & { routes?: AppRouter[] }> = [
    { router: checkoutRouter, routes: checkoutRoutes },
    { router: productPlansRouter, routes: productPlansRoutes },
];

useRoutes.forEach((u) => {
    if (u.routes) {
        registerRoute(u.router, u.routes);
        defaultRoutes.use('/api/payments', u.router);
    }
});

// ==== END ROUTES ====

// ==== SWAGGER ====

const swaggerDoc: OpenAPIV3.Document = {
    openapi: '3.0.0',
    info: { title: 'Redaciona API', version: '1.0.0' },
    components: {
        securitySchemes: {
            Bearer: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    servers: [
        {
            url: `http://localhost:${appConfig.port}/api/payments`,
        },
    ],
    paths: swaggerPaths,
};

defaultRoutes.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// ==== END SWAGGER ====

export default defaultRoutes;
