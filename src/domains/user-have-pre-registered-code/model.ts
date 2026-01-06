import { Model } from 'objection';

export class UserHavePreRegisteredCode extends Model {
    static get tableName() {
        return 'user_have_pre_registered_code';
    }

    static get idColumn() {
        return 'id';
    }

    id: number;
    userid: number;
    code: string;
    completed: boolean;
}
