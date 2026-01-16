import { User, UserWithPermissions } from './model';
import { removeSensitiveData } from '~/domains/users/helpers';

type findByEmailParams = { userEmail: string, getSensitiveData?: boolean };

export interface UserRepository {
    findByEmail({ userEmail, getSensitiveData }: findByEmailParams): Promise<UserWithPermissions | undefined>;
    findById(id: number): Promise<UserWithPermissions | undefined>;
    getUserRole(userEmail: string): Promise<string | undefined>;
    updateUserWithId(id: number, data: Partial<User>): Promise<User>;
}

export class UserImplementation implements UserRepository {
    async findByEmail({
        userEmail,
        getSensitiveData,
    }: findByEmailParams): Promise<UserWithPermissions | undefined> {
        const user = await User
            .query()
            .select('*')
            .where('email', userEmail)
            .modifyGraph('permissions', builder => {
                builder.select('role_name');
            })
            .withGraphFetched('permissions')
            .first();

        if (!user) return undefined;

        return getSensitiveData ? user as UserWithPermissions : removeSensitiveData(user);
    }

    async findById(id: number): Promise<UserWithPermissions | undefined> {
        const user = await User
            .query()
            .select('*')
            .where('id', id)
            .modifyGraph('permissions', builder => {
                builder.select('role_name');
            })
            .withGraphFetched('permissions')
            .first();

        if (!user) return undefined;

        return user as UserWithPermissions;
    }

    async getUserRole(userEmail: string): Promise<string | undefined> {
        const user = await User
            .query()
            .select('user_role_id')
            .modifyGraph('permissions', builder => {
                builder.select('role_name');
            })
            .findOne({ email: userEmail }) as UserWithPermissions;

        if (!user) return undefined;

        return user.permissions?.role_name || 'NOT_DEFINED_ROLE';
    }

    async updateUserWithId(id: number, data: Partial<User>): Promise<User> {
        return User
            .query()
            .patchAndFetchById(id, data);
    }
}
