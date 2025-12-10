import { Model } from 'objection';
import bcrypt from 'bcrypt';
import { appConfig } from '~/config/app.config';
import { Permissions } from '../permissions/model';
import { missionService } from '~/domains/missions/controller';
import { userMissionService } from '~/domains/users-missions/controller';

export type UserWithPermissions = User & {
    permissions: Permissions;
};

export enum UserRolesByIds  {
    TRIAL = 1,
    USER = 2,
    ADMIN = 3,
    PEDAGOGICO = 4,
    FINISHED_TRIAL = 6,
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

    async setUserFirstMissions(userId: number) {
        const userMissionByLevel = await missionService.getMissionsByLevel(1);

        if (userMissionByLevel.length) {
            const missionsIds = userMissionByLevel.map((mission) => mission.id);

            await userMissionService.setUserMissions(userId, missionsIds);
        } else {
            logger.error('Nenhuma missão encontrada para o nível 1');
            return;
        }

    }

    async $beforeInsert() {
        this.created_at = new Date();
        this.updated_at = new Date();
        this.user_role_id = UserRolesByIds.TRIAL;
        this.level = 1;
    }

    $beforeUpdate() {
        this.updated_at = new Date();
    }

    async $afterInsert() {
        await this.setUserFirstMissions(this.id);
    }

    $hiddenFields() {
        return ['secret', 'updated_at', 'deleted_at', 'user_role_id', 'deleted', 'oauth_provider', 'oauth_provider_id'];
    }

    static async hashSecret(secret: string) {
        return await bcrypt.hash(secret, appConfig.bcryptHashQuantity);
    }

    static async confirmSecret(secret: string, hashedSecret: string) {
        return await bcrypt.compare(secret, hashedSecret);
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
