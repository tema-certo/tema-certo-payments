import { EssayPedagogicalOriginImplementation } from '~/domains/essay-pedagogical-origin/repository';
import { EssayPedagogicalOriginService } from '~/domains/essay-pedagogical-origin/services';
import { Request, Response, NextFunction } from 'express';

const repository = new EssayPedagogicalOriginImplementation();
const pedagogicalService = new EssayPedagogicalOriginService(repository);

export async function getAllPossiblePedagogicalOrigin(_: Request, response: Response, next: NextFunction) {
    try {
        const pedagogicalOriginList = await pedagogicalService.getAllPossiblePedagogicalOrigin();

        response.json(pedagogicalOriginList);
    } catch (e) {
        next(e);
    }
};
