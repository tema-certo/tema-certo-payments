import { User, UserWithPermissions } from '~/domains/users/model';
import { UserRepository } from '~/domains/users/repository';
import { generateJwtToken } from '~/middlewares/utils/jwt.utils';
import { removeSensitiveData } from './helpers';
import { DefaultHttpError } from '~/generic-errors';
import { OAuth2Client } from 'google-auth-library';
import { authConfig } from '~/config/auth.config';
import { userHavePreRegisteredCodeService } from '~/domains/user-have-pre-registered-code/controller';
import { userMissionService } from '~/domains/users-missions/controller';
import { IdentifiersEnum } from '~/domains/missions/model';

/*interface CreateUserAsync {
    user: User;
    token: string;
}*/

const client = new OAuth2Client(authConfig?.googleOauthClientId);

export class UserService {
    constructor(private userRepository: UserRepository) {}

    async createUser(user: User): Promise<boolean> {
        const userAlwaysExists = await this.userRepository.userExists(user.email);

        if (userAlwaysExists) {
            throw DefaultHttpError({ element: 'User', error: 'INVALID_ACCESS' });
        }

        const secretHashed = await User.hashSecret(user.secret!);

        const userCreated = await this
            .userRepository
            .createUser({
                ...user,
                secret: secretHashed,
                pre_registered_completed: false,
            });

        if (!userCreated) {
            throw DefaultHttpError({ element: 'User', error: 'NOT_CREATED' });
        }

        const code = await userHavePreRegisteredCodeService.createPreRegisterCode(userCreated.id!);
        // Cria um código de pré-registro para o usuário

        await userHavePreRegisteredCodeService.sendPreRegisterCode(userCreated.id, code.code);

        await userMissionService.updateUserMissions(
            userCreated.id,
            userCreated.level!,
            IdentifiersEnum.LOGIN,
        );

        return true;
    }

    async findById(id: number): Promise<UserWithPermissions | undefined> {
        return this.userRepository.findById(id);
    }

    async loginUser(email: string, password: string): Promise<{
        user: UserWithPermissions,
        token: string,
        completedRegistration: boolean,
    }> {
        const user = await this.userRepository.findByEmail({ userEmail: email, getSensitiveData: true });

        if (!user) {
            throw DefaultHttpError({ error: 'INVALID_ACCESS' });
        }

        const secretValid = await User.confirmSecret(password, user.secret!);

        if (!secretValid) {
            throw DefaultHttpError({ error: 'INVALID_ACCESS' });
        }

        const payload = {
            id: user.id,
        };

        return {
            user,
            token: generateJwtToken(payload),
            completedRegistration: user?.pre_registered_completed,
        };
    }

    async findByEmail(userEmail: string, needData?: boolean): Promise<UserWithPermissions> {
        const user =  await this.userRepository.findByEmail({ userEmail, getSensitiveData: needData });

        if (!user) {
            throw DefaultHttpError({ error: 'NOT_FOUND' });
        }

        return user;
    }

    async updateUserPassword(userId: number, password: string): Promise<true | undefined> {
        const convertedPassword = await User.hashSecret(password);

        const updatedUserPwd = await this.userRepository.updateUserPassword(userId, convertedPassword);

        if (!updatedUserPwd) {
            throw DefaultHttpError({ element: 'User', error: 'NOT_UPDATED' });
        }

        return true;
    }

    async loginWithGoogle(idToken: string): Promise<{ user: UserWithPermissions, token: string }> {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: authConfig?.googleOauthClientId,
        });

        const payload = ticket.getPayload();

        if (!payload) {
            throw DefaultHttpError({ error: 'INVALID_ACCESS' });
        }

        const user = await this.userRepository.findOrCreateOauthUser({
            email: payload.email!,
            providerId: payload.sub,
            name: payload.name!,
        });

        if (!user) {
            throw DefaultHttpError({ error: 'INVALID_ACCESS' });
        }

        return {
            user: removeSensitiveData(user),
            token: generateJwtToken({ id: user.id }),
        };
    }

    async updateUserLevel(userId: number, level: number): Promise<void> {
        await User
            .query()
            .updateAndFetchById(userId, { level });
    }

    async updatePreRegister(userId: number): Promise<void> {
        await this.userRepository.updatePreRegister(userId);
    }
}
