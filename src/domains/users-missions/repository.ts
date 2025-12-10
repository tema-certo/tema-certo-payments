import UserMission from './model';

export enum MissionsIdentifierKeys {
    ESSAYS = 'essays',
}

export type UserWithMissions = {
    id: number;
    title: string;
    objective: string;
    level: number;
    target: {
        count: number;
        identifier: string;
    };
    type: string;
    completed: false;
    progress: number;
}

export interface UserMissionRepository {
    setUserMissions(userId: number, missionIds: number[]): Promise<UserMission[]>;
    getUserMissionsByLevel(
        userId: number,
        level: number,
        completed?: boolean,
        missionKey?: MissionsIdentifierKeys
    ): Promise<UserWithMissions[]>;
    updateUserMissions(userId: number, missionId: number, updateValue: Partial<UserMission>): Promise<number>;
    checkLevelCompleted(userId: number, level: number): Promise<boolean>;
}

export class UserMissionRepositoryImplementation implements UserMissionRepository {
    async setUserMissions(userId: number, missionIds: number[]): Promise<UserMission[]> {
        return UserMission
            .query()
            .insert([
                ...missionIds.map((missionId) => ({
                    user_id: userId,
                    mission_id: missionId,
                    progress: 0,
                    completed: false,
                })),
            ]);
    }

    async getUserMissionsByLevel(
        userId: number,
        level: number,
        completed?: boolean,
        missionKey?: MissionsIdentifierKeys,
    ): Promise<UserWithMissions[]> {
        const query = UserMission
            .query()
            .select('mission.*', 'user_missions.completed', 'user_missions.progress')
            .innerJoinRelated('mission')
            .where('user_missions.user_id', userId)
            .where('mission.level', level);

        if (completed) {
            query.where('completed', completed);
        }

        if (missionKey) {
            query.whereRaw('mission.target->>\'identifier\' = ?', [missionKey]);
        }

        return query as unknown as UserWithMissions[];
    }

    async updateUserMissions(userId: number, missionId: number, updateValue: Partial<UserMission>) {
        return UserMission
            .query()
            .where('user_id', userId)
            .where('mission_id', missionId)
            .patch({
                ...updateValue,
            });
    }

    async checkLevelCompleted(userId: number, level: number): Promise<boolean> {
        const missions = await this.getUserMissionsByLevel(userId, level);

        return missions.every((mission) => mission.completed);
    }
}
