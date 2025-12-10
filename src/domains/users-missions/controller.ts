import { UserMissionRepositoryImplementation, UserWithMissions } from '~/domains/users-missions/repository';
import UserMissionService from '~/domains/users-missions/services';
import { Request, Response, NextFunction } from 'express';

const userMissionRepository = new UserMissionRepositoryImplementation();
export const userMissionService = new UserMissionService(userMissionRepository);

export async function getUserMissions(request: Request, response: Response, next: NextFunction) {
    try {
        const { user } = request;
        let missions = [] as UserWithMissions[];

        if (user?.level) {
            missions = await userMissionService.getUserMissionsByLevel(Number(user?.id), user?.level);
        }

        response.json({ level: user?.level, missions });
    } catch (e) {
        next(e);
    }
}
