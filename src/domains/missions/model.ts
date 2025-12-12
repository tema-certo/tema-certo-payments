import { Model } from 'objection';

export enum MissionEnum {
    PRINCIPAL = 'principal',
    OPTIONAL = 'optional',
}

export enum StrategysEnum {
    COMPARABLE = 'comparable',
    SEQUENTIAL = 'sequential',
    SUM = 'sum',
}

export enum IdentifiersEnum {
    ESSAY_PONTUATION = 'essay_pontuation',
    LOGIN = 'login',
    ESSAYS = 'essays',
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
    target: {
        count: number;
        identifier: IdentifiersEnum;
    };
    type: MissionEnum;
    strategy: StrategysEnum;
};
