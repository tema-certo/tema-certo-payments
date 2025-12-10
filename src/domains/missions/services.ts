import { MissionsRepository } from '~/domains/missions/repository';
import Mission from '~/domains/missions/model';

export class MissionsService {
    constructor(private readonly repository: MissionsRepository) {}

    async getMissionsByLevel(level: number): Promise<Mission[]> {
        return await this.repository.getMissionsByLevel(level);
    }
}
