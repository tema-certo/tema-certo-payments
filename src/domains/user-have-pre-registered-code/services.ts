import {
    UserHavePreRegisteredCodeRepository,
} from '~/domains/user-have-pre-registered-code/repository';
import { UserHavePreRegisteredCode } from '~/domains/user-have-pre-registered-code/model';
import { createAndSendHtmlRendered } from '~/mail/helpers';
import { userService } from '~/domains/users/controller';
import PreRegisteredCodeEmail from '~/templates/PreRegisteredCode';
import { DefaultHttpError } from '~/generic-errors';

export default class UserHavePreRegisteredCodeService {
    constructor(private readonly repository: UserHavePreRegisteredCodeRepository) {}

    async createPreRegisterCode(userId: number): Promise<UserHavePreRegisteredCode> {
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        const preRegisterCode = await this.repository.createPreRegisterCode(userId, code);

        if (!preRegisterCode) {
            throw DefaultHttpError({ element: 'Pre register code', error: 'NOT_CREATED' });
        }

        return preRegisterCode;
    }

    async sendPreRegisterCode(userId: number, code: string) {
        const user = await userService.findById(userId);

        if (!user) {
            return;
        }

        if (user?.oauth_provider_id) {
            return;
        }

        await createAndSendHtmlRendered({
            html: PreRegisteredCodeEmail,
            props: { name: user?.name, code },
            to: user?.email,
            subject: 'Tema Certo - Pré-registro',
        });
    }

    async findUserPreRegisterCode(userId: number): Promise<UserHavePreRegisteredCode | undefined> {
        const searchPreRegister = await this.repository.findUserPreRegister(userId);

        if (!searchPreRegister) {
            throw DefaultHttpError({ element: 'Pre register code', error: 'NOT_FOUND' });
        }

        return searchPreRegister;
    }

    async validateCode(userCode: string, dataBaseCode: string): Promise<boolean> {
        if (userCode !== dataBaseCode) {
            throw DefaultHttpError({ element: 'Pre register code', error: 'INVALID_ACCESS' });
        }

        await this.repository.updatePreRegisterCode(userCode);

        return true;
    }
}
