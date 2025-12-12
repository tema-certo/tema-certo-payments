import {
    UserMissionRepository,
    UserMissionRepositoryImplementation,
} from '~/domains/users-missions/repository';
import { userService } from '~/domains/users/controller';
import { missionService } from '~/domains/missions/controller';
import { IdentifiersEnum } from '~/domains/missions/model';
import UserMission from '~/domains/users-missions/model';

type MissionStrategyPayload = {
    userId: number;
    missionId: number;
    targetValue: number;
    progressValue: number;
    progressCount?: number;
};

const missionRepository = new UserMissionRepositoryImplementation();

class MissionStrategy {
    async sum({ userId, missionId, progressValue, targetValue }:  MissionStrategyPayload){
        const completed = progressValue + 1 >= targetValue;

        const data = {} as Partial<UserMission>;

        if (completed) {
            data.completed = true;
            data.progress = targetValue;
        } else {
            data.progress = progressValue + 1;
        }

        await missionRepository.updateUserMissions(userId, missionId, data);
    }

    async comparable({ userId, missionId, progressValue, targetValue }: MissionStrategyPayload) {
        if (progressValue >= targetValue) {
            await missionRepository.updateUserMissions(userId, missionId,
                {
                    progress: progressValue,
                    completed: true,
                },
            );
        }
    }
}

const strategy = new MissionStrategy();

export default class UserMissionService {
    constructor(private readonly repository: UserMissionRepository) {}

    async setUserMissions(userId: number, missionIds: number[]) {
        return await this.repository.setUserMissions(userId, missionIds);
    }

    async getUserMissionsByLevel(userId: number, level: number, completed?: boolean) {
        return await this.repository.getUserMissionsByLevel(userId, level, completed);
    }

    async updateUserMissions(
        userId: number,
        userLevel: number,
        missionKey: IdentifiersEnum,
        progressCount?: number,
    ) {
        const missions = await this.repository.getUserMissionsByLevel(userId, userLevel, false, missionKey);

        const specificsMissions = missions.filter((item) => item.target.identifier === missionKey);

        for (const mission of specificsMissions) {
            const targetValue = mission?.target?.count || 0;
            const progress = progressCount || mission?.progress || 0;

            await strategy[mission.strategy]({
                userId,
                missionId: mission.id,
                targetValue,
                progressValue: progress,
            });
        }

        const allCompleted = await this.repository.checkLevelCompleted(userId, userLevel);

        if (allCompleted) {
            const newLevel = userLevel + 1;
            await userService.updateUserLevel(userId, newLevel);

            // Adicionar novas missões ao mudar de nível.
            const newMissions = await missionService.getMissionsByLevel(newLevel);

            if (newMissions.length) {
                const missionsIds = newMissions.map((mission) => mission.id);

                await this.setUserMissions(userId, missionsIds);
            }
        }
    }
}
