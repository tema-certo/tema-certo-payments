import { EssayResultsRepository } from '~/domains/essay-results/repository';
import { DefaultHttpError } from '~/generic-errors';
import { EssayJsonResult } from '~/types/UseAi';
import { differenceInDays, startOfDay } from 'date-fns';
import { userMissionService } from '~/domains/users-missions/controller';
import { IdentifiersEnum } from '~/domains/missions/model';

export class EssayResultsService {
    constructor(private readonly repository: EssayResultsRepository) {}

    async createResult(
        userId: number,
        essayTryId: number,
        userScore: number,
        iaResult: EssayJsonResult,
        level: number,
    ) {
        let sequence = 1;
        const actualDate = new Date();

        const lastResult = await this.repository.getLastResultMaxDate(userId);

        if (lastResult?.lastDate) {
            const lastDate = lastResult?.lastDate;

            const lastResultComplete = await this.repository.getLastResultComplete(userId);

            if (differenceInDays(startOfDay(actualDate), startOfDay(lastDate)) === 1) {
                sequence = lastResultComplete!.sequence + 1;
            }

            if (differenceInDays(startOfDay(actualDate), startOfDay(lastDate)) === 0) {
                sequence = lastResultComplete!.sequence;
            }
        }

        const createdResult = await this.repository.createResult(essayTryId, userScore, iaResult, sequence, userId);

        await userMissionService.updateUserMissions(
            userId,
            level,
            IdentifiersEnum.ESSAY_PONTUATION,
            userScore,
        );

        if (!createdResult) throw DefaultHttpError({ element: 'Result', error: 'NOT_CREATED' });

        return createdResult;
    }

    async getUserAverageScore(userId: number) {
        return await this.repository.getUserAverageScore(userId);
    }

    async getEssaysStatisticsByUser(userId: number) {
        const metrics = await this.repository.getUserMetrics(userId);
        const actualDate = new Date();
        const today = startOfDay(actualDate);

        let sequenceFinal = 0;

        if (metrics.sequence?.sequence) {
            sequenceFinal = metrics.sequence.sequence;
        }

        if (metrics.sequence?.lastDate) {
            const lastDate = startOfDay(metrics.sequence.lastDate);

            const diff = differenceInDays(today, lastDate);

            if (diff > 1) {
                // passou mais de 1 dia → quebra a sequência
                sequenceFinal = 0;
            } else if (diff === 1 || diff === 0) {
                // mesmo dia ou próximo dia → mantém a sequência atual
                // (não faz nada, o valor já está em sequenceFinal)
            }
        }

        return {
            ...metrics,
            sequence: sequenceFinal,
        };
    }

    async getListLastResultsByUser(userId: number) {
        return await this.repository.getListLastResultsByUser(userId);
    }

    async getListHighScores() {
        return await this.repository.getListLastHighScores();
    }

    async getCountTotalResults() {
        return await this.repository.getCountTotalResults();
    }
}
