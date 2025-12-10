import { MissionsIdentifierKeys, UserMissionRepository } from '~/domains/users-missions/repository';
import { userService } from '~/domains/users/controller';
import { missionService } from '~/domains/missions/controller';

export default class UserMissionService {
    constructor(private readonly repository: UserMissionRepository) {}

    async setUserMissions(userId: number, missionIds: number[]) {
        return await this.repository.setUserMissions(userId, missionIds);
    }

    async getUserMissionsByLevel(userId: number, level: number, completed?: boolean) {
        return await this.repository.getUserMissionsByLevel(userId, level, completed);
    }

    async updateUserMissions(userId: number, userLevel: number, missionKey: MissionsIdentifierKeys) {
        const missions = await this.repository.getUserMissionsByLevel(userId, userLevel, false, missionKey);

        const specificsMissions = missions.filter((item) => item.target.identifier === missionKey);

        for (const mission of specificsMissions) {
            const targetValue = mission?.target?.count || 0;
            const progress = mission?.progress || 0;

            if (!mission.completed) {
                await this.repository.updateUserMissions(userId, mission.id, { progress: progress + 1 });

                if (progress + 1 >= targetValue) {
                    await this.repository.updateUserMissions(userId, mission.id, { completed: true });
                }
            }
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
