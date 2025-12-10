import { EssayResultsRepositoryImplementation } from '~/domains/essay-results/repository';
import { EssayResultsService } from '~/domains/essay-results/services';
import { Response, Request, NextFunction } from 'express';

const repository = new EssayResultsRepositoryImplementation();
export const essayResultsService = new EssayResultsService(repository);

export const userAverageScore = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { user } = request;
        const averageScore = await essayResultsService.getUserAverageScore(Number(user?.id));

        response.json({ averageScore });
    } catch (e) {
        next(e);
    }
};

export const userStatisticsResults = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { user } = request;
        const results = await essayResultsService.getEssaysStatisticsByUser(Number(user?.id));

        response.json(results);
    } catch (e) {
        next(e);
    }
};

export const userLastResults = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { user } = request;
        const results = await essayResultsService.getListLastResultsByUser(Number(user?.id));

        response.json(results);
    } catch (e) {
        next(e);
    }
};
