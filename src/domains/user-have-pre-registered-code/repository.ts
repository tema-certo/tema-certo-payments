import { UserHavePreRegisteredCode } from '~/domains/user-have-pre-registered-code/model';

export interface UserHavePreRegisteredCodeRepository {
    createPreRegisterCode(userId: number, code: string): Promise<UserHavePreRegisteredCode>;
    findUserPreRegister(userId: number): Promise<UserHavePreRegisteredCode | undefined>;
    updatePreRegisterCode(code: string): Promise<number>;
}

export class UserHavePreRegisteredCodeImplementation implements UserHavePreRegisteredCodeRepository {
    async createPreRegisterCode(userid: number, code: string): Promise<UserHavePreRegisteredCode> {
        return UserHavePreRegisteredCode
            .query()
            .insertAndFetch({ userid, code });
    }

    async findUserPreRegister(userId: number): Promise<UserHavePreRegisteredCode | undefined> {
        return UserHavePreRegisteredCode
            .query()
            .orderBy('id', 'desc')
            .findOne({
                userid: userId,
                completed: false,
            });
    }

    async updatePreRegisterCode(code: string): Promise<number> {
        return UserHavePreRegisteredCode
            .query()
            .where('code', code)
            .patch({ completed: true });
    }
}
