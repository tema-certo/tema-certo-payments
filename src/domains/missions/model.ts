import { Model } from 'objection';

enum MissionEnum {
    PRINCIPAL = 'principal',
    OPTIONAL = 'optional',
}

export default class Mission extends Model {
    static get tableName() {
        return 'missions';
    }

    static get idColumn() {
        return 'id';
    }

    id: number;
    title: string;
    objective: string;
    level: number;
    target: object;
    type: MissionEnum;
};
