import { Model } from 'objection';
import Mission from '~/domains/missions/model';

export default class UserMission extends Model {
    static get tableName() {
        return 'user_missions';
    }

    static get idColumn() {
        return 'id';
    }

    id: number;
    user_id: number;
    mission_id: number;
    progress: number;
    completed: boolean;
    created_at: Date;

    static get relationMappings() {
        return {
            mission: {
                relation: Model.BelongsToOneRelation,
                modelClass: Mission,
                join: {
                    from: 'user_missions.mission_id',
                    to: 'missions.id',
                },
            },
        };
    }
}
