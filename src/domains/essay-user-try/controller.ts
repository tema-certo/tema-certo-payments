import EssayUserTryImplementation from './repository';
import { EssayUserTryService } from './services';
import { NextFunction, Request, Response } from 'express';
import { essayThemesService } from '~/domains/essay-themes/controller';
import { essayResultsService } from '~/domains/essay-results/controller';
import { EssayUserTryStatus } from '~/domains/essay-user-try/model';
import { userMissionService } from '~/domains/users-missions/controller';
import { MissionsIdentifierKeys } from '~/domains/users-missions/repository';

const repository = new EssayUserTryImplementation();
export const essayUserTryService = new EssayUserTryService(repository);

export async function correctEssay(request: Request, response: Response, next: NextFunction) {
    try {
        const { user } = request;

        const {
            try_id,
            theme_id,
            essay,
        } = request.body;

        await essayUserTryService.getTryById(try_id, user.id);

        const theme = await essayThemesService.getThemeById(theme_id);

        const essayCorrected = await essayUserTryService.sendEssayToAi(essay, theme.essayTheme);

        await essayUserTryService.updateTry(
            try_id,
            essay,
            true,
            user.id,
        );

        await essayResultsService.createResult(
            user.id,
            try_id,
            essayCorrected.final_result.total_score,
            essayCorrected,
        );

        await userMissionService.updateUserMissions(
            user.id,
            user?.level,
            MissionsIdentifierKeys.ESSAYS,
        );

        response.json(essayCorrected);
    } catch (e) {
        next(e);
    }
}

export async function saveEssayDraft(request: Request, response: Response, next: NextFunction) {
    try {
        const { user } = request;
        const {
            try_id,
            essay,
        } = request.body;

        await essayUserTryService.updateTry(
            try_id,
            essay,
            false,
            Number(user?.id),
        );

        response.json({ message: 'Redação salva com sucesso.' });
    } catch (e) {
        next(e);
    }
}

export async function getPendingTriesBasedUser(request: Request, response: Response, next: NextFunction) {
    try {
        const tries = await essayUserTryService.getTryListByUserId(
            Number(request.user?.id), EssayUserTryStatus.PENDING,
        );

        response.json(tries);
    } catch(e) {
        next(e);
    }
}

export async function createUserTry(request: Request, response: Response, next: NextFunction) {
    try {
        const { user } = request;
        const {
            essay_theme_id,
        } = request.body;

        const createUserTry = await essayUserTryService.createTry({ essay_theme_id, user_id: Number(user?.id) });

        response.json(createUserTry);
    } catch(e) {
        next(e);
    }
}
