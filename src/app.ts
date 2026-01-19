import './setup';
import express, { Request, Response }  from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from '~/routes';
import '~/knex';
import { errorMiddlewareSent } from './middlewares/errors';
import { webhook } from '~/domains/checkout/controller';
const app = express();

// Routes raw body for Stripe
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), webhook);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(express.static('public'));

// Routes
app.use(routes);

app.use((_request: Request, response: Response) => {
    response.status(404).json({
        error: {
            code: 'NOT_FOUND',
            message: 'Rota não encontrada',
        },
    });
});

app.use(errorMiddlewareSent);

export default app;
