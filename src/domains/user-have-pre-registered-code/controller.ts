import { UserHavePreRegisteredCodeImplementation } from '~/domains/user-have-pre-registered-code/repository';
import UserHavePreRegisteredCodeService from '~/domains/user-have-pre-registered-code/services';
import { Request, Response, NextFunction } from 'express';
import { userService } from '~/domains/users/controller';
import { generateJwtToken } from '~/middlewares/utils/jwt.utils';

const repository = new UserHavePreRegisteredCodeImplementation();
export const userHavePreRegisteredCodeService = new UserHavePreRegisteredCodeService(repository);

export async function resendEmailConfirmation(request: Request, response: Response, next: NextFunction) {
    try {
        response.status(200).json();

        const { email } = request.body;

        const { id } = await userService.findByEmail(email, true);

        const data = await userHavePreRegisteredCodeService.findUserPreRegisterCode(id);

        if (data) {
            await userHavePreRegisteredCodeService.sendPreRegisterCode(id, data?.code);
        }
    } catch (e) {
        next(e);
    }
}

export async function validateCodeConfirmation(request: Request, response: Response, next: NextFunction) {
    try {
        const {
            email,
            code,
        } = request.body;

        const { id } = await userService.findByEmail(email, true);

        const data = await userHavePreRegisteredCodeService.findUserPreRegisterCode(id);

        if (data) {
            const ok = await userHavePreRegisteredCodeService.validateCode(code, data?.code);

            if (ok) {
                await userService.updatePreRegister(id);

                response.status(200).json({
                    token: generateJwtToken({ id }),
                });
            }
        }
    } catch (e) {
        next(e);
    }
}
