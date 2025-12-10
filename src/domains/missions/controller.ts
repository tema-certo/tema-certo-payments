import MissionsRepositoryImplementation from '~/domains/missions/repository';
import { MissionsService } from '~/domains/missions/services';

const missionRepository = new MissionsRepositoryImplementation();
export const missionService = new MissionsService(missionRepository);
