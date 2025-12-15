import { EssayResults } from '~/domains/essay-results/model';
import { EssayJsonResult } from '~/types/UseAi';
import { EssayUserTry } from '../essay-user-try/model';

type UserMetrics = {
    maxScore: number;
    totalEssays: number;
    monthlyEssays: number;
    sequence: {
        sequence: number;
        lastDate: Date | null;
    };
};

export interface EssayResultsRepository {
    createResult(
        essayTryId: number,
        userScore: number,
        iaResult: EssayJsonResult,
        sequence: number,
        userId: number,
    ): Promise<EssayResults>;
    getUserAverageScore(userId: number): Promise<number>;
    getUserMetrics(userId: number): Promise<UserMetrics>;
    getLastResultMaxDate(userId : number): Promise<EssayResults & { lastDate: Date } | undefined>;
    getLastResultComplete(userId: number): Promise<EssayResults | undefined>;
    getListLastResultsByUser(userId: number): Promise<EssayResults[]>;
    getListLastHighScores(): Promise<EssayResults[]>;
}

export class EssayResultsRepositoryImplementation implements EssayResultsRepository {
    async createResult(
        essayTryId: number,
        userScore: number,
        iaResult: EssayJsonResult,
        sequence: number,
        userId: number,
    ): Promise<EssayResults> {
        const resultData = {
            essay_try_id: essayTryId,
            score: userScore,
            ia_result: iaResult,
            user_id: userId,
            sequence,
        };

        return EssayResults
            .query()
            .insertAndFetch(resultData);
    }

    async getUserAverageScore(userId: number): Promise<number> {
        const averageScore = await EssayUserTry
            .query()
            .innerJoinRelated('results')
            .where('essay_user_try.user_id', userId)
            .avg('results.score as average')
            .first() as EssayUserTry & { average: number };

        return Number(Math.round(averageScore?.average)) || 0;
    }

    async getUserMetrics(userId: number): Promise<UserMetrics> {
        const date = new Date();
        const actualMonth = date.getMonth();

        const metrics = await EssayResults
            .query()
            .max('score as maxScore')
            .count('* as totalEssays')
            .where('user_id', userId)
            .first() as EssayResults & UserMetrics;

        const monthlyMetrics = await EssayResults
            .query()
            .where('user_id', userId)
            .count('* as monthlyEssays')
            .andWhere('created_at', '>=', new Date(date.getFullYear(), actualMonth, 1))
            .andWhere('created_at', '<=', new Date(date.getFullYear(), actualMonth, 31))
            .first() as EssayResults & UserMetrics;

        const sequenceMetric = await EssayResults
            .query()
            .where('user_id', userId)
            .select('sequence', 'created_at')
            .orderBy('created_at', 'desc')
            .first();

        return {
            maxScore: Number(Math.round(metrics?.maxScore )) || 0,
            totalEssays: metrics?.totalEssays || 0,
            monthlyEssays: monthlyMetrics?.monthlyEssays || 0,
            sequence: {
                sequence: sequenceMetric?.sequence || 0,
                lastDate: sequenceMetric?.created_at ?? null,
            },
        };
    }

    async getLastResultMaxDate(userId: number): Promise<EssayResults & { lastDate: Date } | undefined> {
        return EssayResults
            .query()
            .max('created_at as lastDate')
            .where('user_id', userId)
            .first() as unknown as EssayResults & { lastDate: Date };
    }

    async getLastResultComplete(userId: number): Promise<EssayResults | undefined> {
        return EssayResults
            .query()
            .where('user_id', userId)
            .orderBy('created_at', 'desc')
            .first();
    }

    async getListLastResultsByUser(userId: number): Promise<EssayResults[]> {
        return EssayResults
            .query()
            .select('score', 'themes.theme_title', 'essay_results.created_at as date')
            .innerJoinRelated('essay_user_try')
            .innerJoinRelated('themes')
            .where('essay_results.user_id', userId)
            .orderBy('essay_results.created_at', 'desc')
            .limit(10);
    }

    async getListLastHighScores(): Promise<EssayResults[]> {
        return EssayResults
            .query()
            .select('score', 'themes.theme_title', 'essay_results.created_at as date', 'user.name')
            .innerJoinRelated('essay_user_try')
            .innerJoinRelated('user')
            .innerJoinRelated('themes')
            .orderBy('score', 'desc')
            .orderBy('essay_results.created_at', 'desc')
            .limit(20);
    }
}
