import { Model } from 'objection';
import { Permissions } from '../permissions/model';

export type UserWithPermissions = User & {
    permissions: Permissions;
};

export enum UserRolesByIds  {
    FREE = 1,
    BASIC = 2,
    ADMIN = 3,
    PEDAGOGICO = 4,
    PRO = 6,
}

export class User extends Model {
    static get tableName() {
        return 'users';
    }

    static get idColumn() {
        return 'id';
    }

    id: number;
    name: string;
    email: string;
    secret: string | null;
    deleted: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
    user_role_id: number;
    oauth_provider: string;
    oauth_provider_id: string;
    level: number;
    pre_registered_completed: boolean;

    async $beforeInsert() {
        this.created_at = new Date();
        this.updated_at = new Date();
        this.user_role_id = UserRolesByIds.FREE;
        this.level = 1;
    }

    $beforeUpdate() {
        this.updated_at = new Date();
    }

    $hiddenFields() {
        return ['secret', 'updated_at', 'deleted_at', 'user_role_id', 'deleted', 'oauth_provider', 'oauth_provider_id'];
    }

    static get relationMappings() {
        return {
            permissions: {
                relation: Model.BelongsToOneRelation,
                modelClass: Permissions,
                join: {
                    from: 'users.user_role_id',
                    to: 'permissions.id',
                },
            },
        };
    }
}
