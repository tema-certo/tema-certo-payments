import { Model } from 'objection';
import { User } from '../users/model';

export enum UserRoles {
    ADMIN = 'ai:adm',
    USER_FREE = 'ai:free',
    USER_BASIC = 'ai:basic',
    USER_PRO = 'ai:pro',
    PEDAGOGICO = 'ai:pedagogico'
}

export const RoleByPlan: Record<string, number> = {
    FREE: 1,
    BASIC: 2,
    PRO: 6,
    ADM: 3,
    PEDAGOGICO: 4,
};

export class Permissions extends Model {
    static get tableName() {
        return 'permissions';
    }

    static get idColumn() {
        return 'id';
    }

    id: number;
    role_name: UserRoles;

    static get relationMappings() {
        return {
            permissions: {
                relation: Model.HasManyRelation,
                modelClass: User,
                join: {
                    from: 'permissions.id',
                    to: 'users.user_role_id',
                },
            },
        };
    }
}
