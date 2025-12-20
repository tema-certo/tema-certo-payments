import { NextFunction, Response, Request } from 'express';
import { JwtPayload, verifyJwtToken } from './utils/jwt.utils';
import { JsonWebTokenError } from 'jsonwebtoken';
import { DefaultHttpError } from '~/generic-errors';
import { userService } from '~/domains/users/controller';

export async function authentication(request: Request, _response: Response, next: NextFunction) {
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
        throw DefaultHttpError({ error: 'UNAUTHORIZED_TOKEN_NOT_FOUND' });
    }

    try {
        const userId = verifyJwtToken(token) as JwtPayload;

        if (!userId.id) {
            throw DefaultHttpError({ error: 'UNAUTHORIZED_INVALID_TOKEN' });
        }

        const user = await userService.findById(userId.id);

        if (!user) {
            throw DefaultHttpError({ error: 'UNAUTHORIZED_INVALID_TOKEN' });
        }

        request.user = user;

        next();
    } catch (e) {
        if (e instanceof JsonWebTokenError) {
            throw DefaultHttpError({ error: 'UNAUTHORIZED_INVALID_TOKEN' });
        }

        throw e;
    }
}
