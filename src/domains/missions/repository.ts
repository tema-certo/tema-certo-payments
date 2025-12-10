import Mission from '~/domains/missions/model';

export interface MissionsRepository {
    getMissionsByLevel(level: number): Promise<Mission[]>;
}

export default class MissionsRepositoryImplementation implements MissionsRepository {
    async getMissionsByLevel(level: number): Promise<Mission[]> {
        return Mission
            .query()
            .where('level', level);
    }
}
